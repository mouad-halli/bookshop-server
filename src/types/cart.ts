import { ObjectId } from "mongoose";
import { IUser } from "./user";
import { IBook } from "./book";

export interface ICartItem {
    product: IBook
    quantity: number
}

export interface ICart {
    _id: ObjectId
    owner: IUser
    items: ICartItem[]
}