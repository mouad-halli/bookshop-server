import mongoose from "mongoose";
import { connectToDatabase } from "./config/database";
import { UserDto } from "./types/user";
import User from './models/user'
import bcryptjs from 'bcryptjs'

const users: UserDto[] = [
    {
        firstname: "seller",
        lastname: "seller",
        email: "seller@gmail.com",
        password: "Password123*",
        isSeller: true
    },
    {
        firstname: "buyer",
        lastname: "buyer",
        email: "buyer@gmail.com",
        password: "Password123*",
        isSeller: false
    }
]

const hashPasswords = async (users: UserDto[]) => {
    const salt = await bcryptjs.genSalt(10)
    return Promise.all(
        users.map(async (user) => {
            const hashedPassword = await bcryptjs.hash(user.password, salt)
            return { ...user, password: hashedPassword }
        })
    )
}

const seedDatabase = async () => {
    try {
        // connect to mongodb database
        await connectToDatabase()

        const usersToSeed = await hashPasswords(users);
        // insert array of users to the database
        const createdUsers = await User.insertMany(usersToSeed)

        // disconnect from the database
        mongoose.connection.close()

    } catch (error) {
        console.error('error seeding database : ', error)
        mongoose.connection.close()
    }
}

seedDatabase()