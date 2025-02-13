import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import Cart from '../models/cart'
import { ICartItem } from '../types/cart'
import Book from '../models/book'
import { isValidObjectId } from 'mongoose'
import { createError } from '../utils/error'

const { OK, CREATED, BAD_REQUEST, NOT_FOUND } = StatusCodes

const getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { _id: userId } = req.user
        const cart: { items: ICartItem[], subTotal: Number } = { items: [], subTotal: 0 }

        const userCart = await Cart.findOne({ owner: { _id: userId } }).populate({
            path: 'items.product'
        }).select("items")

        // if (userCart) {
        //     cart.items = userCart.items
        //     cart.subTotal = cart.items.reduce((accumulator, currentItem) => accumulator + (currentItem.product.price * currentItem.quantity), 0)
        // }

        res.status(OK).json(userCart ? userCart.items : [])
    } catch (error) {
        next(error)
    }
}

const upsertCartItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { _id: userId } = req.user
        const userCart = await Cart.findOne({ owner: { _id: userId } })
        const quantity = Number(req.query.quantity)
        const productId = req.query.book_id

        if (!productId || !isValidObjectId(productId))
            return next(createError(BAD_REQUEST, 'invalid product id'))

        const product = await Book.findOne({ _id: productId })

        if (!product)
            return next(createError(NOT_FOUND, "product not found"))

        if (product.stockCount < quantity)
            return next(createError(BAD_REQUEST, "product has insufficient quantity"))

        if (userCart) {
            const itemIndex = userCart.items.findIndex(cartItem => String(cartItem.product._id) === productId)

            if (itemIndex !== -1) {
                if (quantity === 0)
                    userCart.items.splice(itemIndex, 1)
                else
                    userCart.items[itemIndex].quantity = quantity
            }
            else if (quantity)
                userCart.items.push({ product, quantity })
            else
                return next(createError(BAD_REQUEST, "please provide a quantity for the product"))

            await userCart.save()
        }
        else {
            await Cart.create({
                owner: userId,
                items: [{ product, quantity }]
            })
        }

        res.status(CREATED).json("cart updated successfully")

    } catch (error) {
        next(error)
    }
}

const upsertCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCart = await Cart.findOne({ owner: req.user  })

        if (userCart) {

        }
        else {

        }

    } catch (error) {
        next(error)
    }
}

export = {
    getCart, upsertCartItem, upsertCart
}