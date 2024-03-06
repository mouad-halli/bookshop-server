import { ObjectId } from "mongoose";
import { IUser } from "./user";
import { IBook } from "./book";

export interface ICart {
    _id: ObjectId
    owner: IUser
    items: IBook[]
}