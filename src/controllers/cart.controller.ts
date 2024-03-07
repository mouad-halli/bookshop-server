import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import Cart from '../models/cart'
import { IBook } from '../types/book'
import { ICartItem } from '../types/cart'
import Book from '../models/book'
import { isValidObjectId } from 'mongoose'
import { createError } from '../utils/error'
import user from '../models/user'

const { OK, CREATED, BAD_REQUEST, NOT_FOUND } = StatusCodes

const getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { _id: userId } = req.user
        const cart: { items: ICartItem[], subTotal: Number } = { items: [], subTotal: 0 }

        const userCart = await Cart.findOne({ owner: { _id: userId } }).select("items")

        if (userCart) {
            cart.items = userCart.items
            cart.subTotal = cart.items.reduce((accumulator, currentItem) => accumulator + (currentItem.product.price * currentItem.quantity), 0)
        }

        res.status(OK).json(cart)
    } catch (error) {
        next(error)
    }
}

const updateCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { _id: userId } = req.user
        const userCart = await Cart.findOne({ owner: { _id: userId } })
        const quantity = Number(req.params.quantity)
        const productId = req.params.productId


        if (!productId || !isValidObjectId(productId))
            return next(createError(BAD_REQUEST, 'invalid product id'))

        const product = await Book.findOne({ _id: productId })

        if (!product)
            return next(createError(NOT_FOUND, "product not found"))

        if (userCart) {
            const itemIndex = userCart.items.findIndex(cartItem => String(cartItem.product._id) === productId)

            if (itemIndex !== -1) {
                if (quantity)
                    userCart.items[itemIndex].quantity = quantity
                else
                    userCart.items.splice(itemIndex, 1)
            }
            else if (quantity)
                userCart.items.push({ product, quantity })
            else
                return next(createError(BAD_REQUEST, "please provide a quantity for the product"))

            await userCart.save()
        }
        else {
            await new Cart({
                owner: userId,
                items: [{ product, quantity }]
            }).save()
        }

        res.status(CREATED).json("cart updated successfully")

    } catch (error) {
        next(error)
    }
}

export = {
    getCart, updateCart
}