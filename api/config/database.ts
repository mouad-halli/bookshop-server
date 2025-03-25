import mongoose from 'mongoose'
import { DB_LINK } from './environment'

mongoose.set("strictQuery", false)

const connectToDatabase = async () => {
    try {
        await mongoose.connect(String(DB_LINK))
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