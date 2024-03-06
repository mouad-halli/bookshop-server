import { ObjectId } from "mongoose";
import { IUser } from "./user";
import { IBook } from "./book";

export interface ICartItem {
    item: IBook
    quantity: number
}

export interface ICart {
    _id: ObjectId
    owner: IUser
    items: ICartItem[]
}