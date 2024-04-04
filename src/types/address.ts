import { Schema } from "mongoose";
import { IUser } from "./user";

export interface IAddress {
    _id: Schema.Types.ObjectId,
    user: IUser,
    address1: string,
    address2: string,
    country: string,
    city: string,
    zipCode: number
}