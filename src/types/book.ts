import { ObjectId } from "mongoose";
import { IUser } from "./user";

export interface IBook {
    _id: ObjectId
    title: string
    author: string
    description: string
    price: number
    year: number
    genre: string
    bookLanguage: string
    seller: IUser
}

export interface UpdateBook extends Partial<IBook> {}