import { ObjectId } from "mongoose"
import { IBook } from "./book"

export interface IUser {
    _id: ObjectId
    firstname: string
    lastname: string
    email: string
    password: string
    isSeller: boolean
    imgUrl?: string
    accessToken?: string
    refreshToken?: string
    googleId?: string
    books?: IBook
}

export interface UserDto extends Omit<IUser, '_id' | 'accessToken' | 'refreshToken'> {}

export interface Usertype extends Omit<IUser, 'password' | 'accessToken' | 'refreshToken'> {}

export interface UpdateUserDto extends Partial<UserDto> {}