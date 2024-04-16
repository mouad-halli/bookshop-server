import { ObjectId } from "mongoose";
import Book from '../models/book'

export const getBooksByUserId = async (userId: string) => {
    return await Book.find({ seller: userId })
}