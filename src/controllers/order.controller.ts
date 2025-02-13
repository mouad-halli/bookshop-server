import { Request, Response, NextFunction } from "express";
import Cart from "../models/cart";
import { StatusCodes } from "http-status-codes";
import { createError } from "../utils/error";
import { IOrder, IOrderItem } from '../types/order';
import OrderItem from '../models/orderItem'
import Order from '../models/order'
import { IBook } from "../types/book";
import mongoose, { ClientSession, ObjectId } from "mongoose";
import Book from '../models/book'

const { OK, NOT_FOUND, BAD_REQUEST } = StatusCodes

const checkout = async (req: Request, res: Response, next: NextFunction) => {
    const session: ClientSession = await mongoose.startSession()
    session.startTransaction()
    try {

        const cart = await Cart.findOne({ owner: req.user._id })
            .populate({
                path: "items.product",
                select: "price stockCount seller title"
            }
        ).session(session)

        if (!cart)
            return next(createError(NOT_FOUND, "Cart was not found"))

        const order = new Order({
            customer: req.user._id,
            totalAmount: 0,
            items: []
        })

        const orderItems: IOrderItem[] = []
        let totalAmount = 0

        for (const {product, quantity} of cart.items) {
            if (product.stockCount < quantity) {
                await session.abortTransaction()
                session.endSession()
                next(createError(BAD_REQUEST, "insufficient quantity"))
            }

            const savedOrderItem = await new OrderItem({
                order: order._id,
                seller: product.seller._id,
                product: product,
                name: product.title,
                quantity,
                unitPrice: product.price
            })
            .save({ session })

            orderItems.push(savedOrderItem)

            totalAmount += product.price * quantity

            await Book.updateOne(
                { _id: product._id, stockCount: { $gte: quantity } },
                { $inc: { stockCount: -quantity } },
                { session }
            )

        }

        order.items = orderItems
        order.totalAmount = totalAmount

        await order.save({ session })
        
        await Cart.findByIdAndDelete(cart._id, { session })
        await session.commitTransaction()
        session.endSession()

        res.status(OK).json("orders created successfully")

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        next(error)
    }
}

const getCustomerOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await Order.find({customer: { _id: req.user._id }}).select("-customer")

        res.status(OK).json(orders)
        
    } catch (error) {
        next(error)
    }
}

const getSellerOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await OrderItem.find(
            { seller: req.user._id },
            { seller: 0 }
        )
        .populate({
            path: "order",
            select: "customer totalAmount",
            populate: {
                path: "customer",
                select: "firstname lastname"
            }
        })

        res.status(OK).json(orders)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export = {
    checkout,
    getCustomerOrders,
    getSellerOrders,
}