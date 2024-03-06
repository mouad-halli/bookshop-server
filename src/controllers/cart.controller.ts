import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import Cart from '../models/cart'
import { IBook } from '../types/book'
import { ICartItem } from '../types/cart'

const { OK, CREATED, BAD_REQUEST } = StatusCodes

const getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { _id: userId } = req.user
        const cart: { items: ICartItem[], subTotal: Number } = { items: [], subTotal: 0 }

        const userCart = await Cart.findOne({ owner: { _id: userId } }).select("items")

        if (userCart) {
            cart.items = userCart.items
            cart.subTotal = cart.items.reduce((accumulator, currentItem) => accumulator + (currentItem.item.price * currentItem.quantity), 0)
        }

        res.status(OK).json(cart)
    } catch (error) {
        next(error)
    }
}

const updateCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(OK).json("update Cart")
    } catch (error) {
        next(error)
    }
}

export = {
    getCart, updateCart
}