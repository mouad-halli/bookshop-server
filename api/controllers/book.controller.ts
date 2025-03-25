import { Request, Response, NextFunction } from "express"
import Book from "../models/book"
import { isValidObjectId } from 'mongoose';
import { createError } from "../utils/error";
import { StatusCodes } from "http-status-codes";
import { findSellers } from '../services/user.service';
import { getBooksByUserId } from "../services/book.service";
import User from '../models/user'
import cloudinary from "../config/cloudinary";
import { Readable } from "stream";

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

        if (!req.file)
            return next(createError(BAD_REQUEST, "please upload the book image"))
        
        const { title, author, description, genre, bookLanguage, price, year, stockCount } = req.body

        const newBook = new Book({
            title, author, description, genre, bookLanguage, price, year, stockCount,
            seller: req.user._id
        })

        const fileStream = new Readable()

        fileStream.push(req.file.buffer)
        fileStream.push(null)

        const uploadStream = cloudinary.uploader.upload_stream({
            folder: "bookshop/books",
            resource_type: "image",
            public_id: String(newBook._id)
        }, async (error, result) => {

            if (error || !result)
                return next(createError(BAD_REQUEST, "failed to upload the book image"))

            newBook.imageUrl = result.secure_url

            await newBook.save()

            await User.findByIdAndUpdate(req.user._id, { $push: { books: newBook } })
            
            res.status(OK).json(newBook)
        })

        fileStream.pipe(uploadStream)

    } catch (error) {
        next(error)
    }
}

const updateBook = async (req: Request, res: Response, next:NextFunction) => {
    try {

        if (!isValidObjectId(req.params.book_id))
            return next(createError(BAD_REQUEST, "invalid book id"))

        if (req.file) {

            const fileStream = new Readable()

            fileStream.push(req.file.buffer)
            fileStream.push(null)

            const uploadStream = cloudinary.uploader.upload_stream({
                folder: "bookshop/books",
                resource_type: "image",
                public_id: String(req.params.book_id),
                overwrite: true
            }, async (error, result) => {

                if (error || !result)
                    return next(createError(BAD_REQUEST, "failed to upload the book image"))

                await Book.findByIdAndUpdate(req.params.book_id, { imageUrl: result.secure_url })

            })

            fileStream.pipe(uploadStream)
        }

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

        await cloudinary.uploader.destroy(String(book._id));
        await book.deleteOne()

        res.status(NO_CONTENT).send()

    } catch (error) {
        next(error)
    }
}

const getLastAddedBooks = async (req: Request, res: Response, next:NextFunction) => {
    try {
        
    } catch (error) {
        next(error)
    }
}

const searchBooks = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const searchQuery = String(req.query.q)

        const searchResult = await Book.aggregate([
            {
                $search: {
                    index: "book_search_index",  // Replace with the actual index name if different
                    compound: {
                        should: [
                            {
                                autocomplete: {
                                    query: searchQuery,
                                    path: "title",
                                    fuzzy: { maxEdits: 1 },  // Optional: allows minor typos
                                    score: { boost: { value: 10 } }
                                }
                            },
                            {
                                autocomplete: {
                                    query: searchQuery,
                                    path: "author",
                                    fuzzy: { maxEdits: 1 },
                                    score: { boost: { value: 7 } }
                                }
                            },
                            {
                                autocomplete: {
                                    query: searchQuery,
                                    path: "genre",
                                    fuzzy: { maxEdits: 1 },
                                    score: { boost: { value: 4 } }
                                }
                            }
                        ]
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    author: 1,
                    genre: 1,
                    price: 1,
                    stockCount: 1,
                    // description: 1,
                    imageUrl: 1,
                    // seller: 1
                }
            }
        ])

        res.status(OK).json(searchResult)
    } catch (error) {
        next(error)
    }
}

export = {
    getBookById, createBook, updateBook, deleteBook, getLastAddedBooks, searchBooks
}