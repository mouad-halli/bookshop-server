import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import User from '../models/user'
import bcryptjs from 'bcryptjs'
import { createError } from "../utils/error"
import { SERVER_URL } from "../config/environment"
import Address from "../models/address"
import Book from "../models/book"
import { isValidObjectId } from "mongoose"
import { getBooksByUserId } from "../services/book.service"

const { OK, CREATED, BAD_REQUEST } = StatusCodes

const getUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        
        res.status(OK).json('get user called')

    } catch (error) {
        next(error)
    }
}

const getMe = (req: Request, res: Response, next: NextFunction) => {
    res.status(OK).json(req.user)
}

const createUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        
        res.status(OK).json('create user called')

    } catch (error) {
        next(error)
    }
}

const updateUserInformation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.email) {
            if (await User.findOne({$and: [{email: req.body.email}, {_id: {$ne: req.user._id}}]}))
                return next(createError(BAD_REQUEST, "\"email\" email already in use"))
        }

        if (req.body.password) {
            const salt = await bcryptjs.genSalt(10)
            const hash = await bcryptjs.hash(req.body.password, salt)
            req.body.password = hash
        }

        const updatedUserData = await User.findOneAndUpdate(
            {_id: req.user._id},
            { $set: req.body },
            { new: true, fields: { _id: 0, __v: 0 } }
        )

        res.status(CREATED).json(updatedUserData)

    } catch (error) {
        next(error)
    }
}

const getUserAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userAddress = await Address.findOne({user: req.user._id})
        
        res.status(OK).json(userAddress)
    } catch (error) {
        next(error)
    }
}

const upsertUserAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const userAddress = await Address.findOneAndUpdate(
            { user: req.user._id},
            { $set: req.body },
            { new: true, fields: { _id: 0, __v: 0 }, upsert: true }
        )

        res.status(OK).json(userAddress)

    } catch (error) {
        next(error)
    }
}

const updateUserPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { currentPassword, newPassword } = req.body

        const user = await User.findOne({_id: req.user._id}).select("password")

        if (!user || !await bcryptjs.compare(currentPassword, user.password))
            return next(createError(BAD_REQUEST, "\"currentPassword\" incorrect password"))

        const salt = await bcryptjs.genSalt(10)
        const hash = await bcryptjs.hash(req.body.password, salt)
        req.body.password = hash

        await User.findOneAndUpdate(
            {_id: req.user._id},
            { $set: { password: newPassword } }
        )

        res.status(CREATED).json("password updated successfully")

    } catch (error) {
        next(error)
    }
}

// const updateUserImage = async (req: Request, res: Response, next: NextFunction) => {
//     try {

//         if (!req.file)
//             return next(createError(BAD_REQUEST, 'please provide an image'))

//         const imgPath: string = `${SERVER_URL}/${req.file.path}`

//         await User.findOneAndUpdate({_id: req.user._id}, {imgUrl: imgPath})

//         res.status(CREATED).json(imgPath)

//     } catch (error) {
//         next(error)
//     }
// }

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        res.status(OK).json('delete user called')

    } catch (error) {
        next(error)
    }
}

const getUserListings = async (req: Request, res: Response, next: NextFunction) => {

    try {

        if (!isValidObjectId(req.params.user_id))
            return next(createError(BAD_REQUEST, "invalid user id"))

        const userListings = await getBooksByUserId(req.params.user_id, 0)

        res.status(OK).json(userListings)

    } catch (error) {
        next(error)
    }

}

const getMyListings = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const userListings = await getBooksByUserId(String(req.user._id), 0)

        res.status(OK).json(userListings)

    } catch (error) {
        next(error)
    }

}

const updateUserSellerStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await User.findOneAndUpdate(req.user._id, { isSeller: req.body.isSeller })
        res.status(CREATED).send()
    } catch (error) {
        next(error)
    }
}

const getUsersWithLastAddedBooks = async (req: Request, res: Response, next:NextFunction) => {
    try {

        const sellersLimit = Number(req.query.sellers_limit) || 5
        const booksLimit = Number(req.query.books_limit) || 12

        const sellers = await User.find(
            { books: { $exists: true, $ne: [] } },
            { books: { $slice: booksLimit } },
            { limit: sellersLimit }
        )
        .populate({
            path: "books",
            select: "imageUrl"
        })

        res.status(OK).json(sellers)

    } catch (error) {
        next(error)
    }
}


export = {
    getUser, createUser, updateUserInformation, upsertUserAddress, updateUserPassword,
    deleteUser, getMe, getUserAddress, getUserListings, getMyListings/*updateUserImage*/,
    updateUserSellerStatus, getUsersWithLastAddedBooks
}