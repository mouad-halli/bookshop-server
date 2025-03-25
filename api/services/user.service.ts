import { ObjectId } from 'mongoose'
import User from '../models/user'
import { title } from 'process'

export const findUser = async (userId: string) => {

    return await User.findById(userId)

}

export const findSellers = async (limit: number) => {
    return await User.find().limit(limit).select({
        _id: true
    })
}
