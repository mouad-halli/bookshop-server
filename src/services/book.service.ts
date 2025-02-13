import { FilterQuery, ObjectId } from "mongoose";
import Book from '../models/book'
import { IBook } from "../types/book";

export const getBooksByUserId = async (userId: string, limit: number) => {
    return await Book.find({ seller: userId }).limit(limit)
}