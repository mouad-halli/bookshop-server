import mongoose from 'mongoose'
import { DB_LINK } from './environment'

mongoose.set("strictQuery", false)

const connectToDatabase = async () => {
    try {
        await mongoose.connect(String(DB_LINK), {
            bufferCommands: false, // Disable command buffering (models won't queue commands if not connected)
            serverSelectionTimeoutMS: 30000, // Wait up to 30s for MongoDB to respond
            connectTimeoutMS: 30000,         // Wait up to 30s for initial TCP connection
    })
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