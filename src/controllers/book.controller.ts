import { Request, Response, NextFunction } from "express"
import Book from "../models/book"
import { isValidObjectId } from 'mongoose';
import { createError } from "../utils/error";
import { StatusCodes } from "http-status-codes";

const { OK, CREATED, BAD_REQUEST, FORBIDDEN, NO_CONTENT } = StatusCodes

const getBookById = async (req: Request, res: Response, next:NextFunction) => {
    try {

        if (!isValidObjectId(req.params.book_id))
            return next(createError(BAD_REQUEST, "invalid book id"))

        const book = await Book.findById(req.params.book_id)

        if (!book)
            return next(createError(BAD_REQUEST, "book not found"))

        res.status(OK).json(book)

    } catch (error) {
        next(error)
    }
}

const createBook = async (req: Request, res: Response, next:NextFunction) => {
    try {
        
        const { title, author, description, genre, bookLanguage, price, year } = req.body

        const book = await Book.create({
            title, author, description, genre, bookLanguage, price, year,
            seller: req.user._id
        })

        res.status(OK).json(book)

    } catch (error) {
        next(error)
    }
}

const updateBook = async (req: Request, res: Response, next:NextFunction) => {
    try {

        if (!isValidObjectId(req.params.book_id))
            return next(createError(BAD_REQUEST, "invalid book id"))

        const updatedBook = await Book.findOneAndUpdate(
            {_id: req.params.book_id, seller: req.user._id},
            { $set: req.body },
            { new: true }
        )

        res.status(CREATED).json(updatedBook)

    } catch (error) {
        next(error)
    }
}

const deleteBook = async (req: Request, res: Response, next:NextFunction) => {
    try {
        if (!isValidObjectId(req.params.book_id))
            return next(createError(BAD_REQUEST, "invalid book id"))

        const book = await Book.findOne({_id: req.params.book_id})

        if (!book)
            return next(createError(BAD_REQUEST, "book not found"))
        if (String(req.user._id) !== String(book.seller._id))
            return next(createError(FORBIDDEN, "only the book owner can delete his listing"))

        await book.deleteOne()

        res.status(NO_CONTENT).send()

    } catch (error) {
        next(error)
    }
}

export = {
    getBookById, createBook, updateBook, deleteBook
}