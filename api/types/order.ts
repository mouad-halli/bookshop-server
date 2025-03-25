import { ObjectId } from "mongoose";
import { IUser } from "./user";
import { IBook } from "./book";

export interface IOrderItem {
    _id: ObjectId
    order: IOrder
    seller: IUser
    product: IBook
    name: string
    quantity: number
    unitPrice: number
    status: string
    // shippingStatus: string
    createdAt: Date
    updateAt: Date
}

export interface IOrder {
    _id: ObjectId
    customer: IUser
    // seller: IUser
    items: IOrderItem[]
    status: string,
    totalAmount: number
    createdAt: Date
    updateAt: Date
}