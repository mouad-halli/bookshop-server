import mongoose from 'mongoose'
import { MONGODB_URI } from './environment'

mongoose.set("strictQuery", false)

const connectToDatabase = async () => {
    try {
        await mongoose.connect(String(MONGODB_URI))
    } catch (error) {
        throw error
    }
}

mongoose.connection.on('connected', () => {
    console.log('database connected')
})


mongoose.connection.on('disconnected', () => {
    console.log('database disconnected')
})

export { connectToDatabase }