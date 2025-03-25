import dotenv from 'dotenv'
dotenv.config()

const PORT: number = Number(process.env.PORT || 8000)

const DB_LINK: string = String(process.env.DB_LINK)

// Front end
const CLIENT_URL: string = String(process.env.CLIENT_URL)

// Back end
const SERVER_URL: string = String(process.env.SERVER_URL)

// TOKENS SECRET AND EXPIRATION DATE
const ACCESS_TOKEN_SECRET: string = String(process.env.ACCESS_TOKEN_SECRET)

const REFRESH_TOKEN_SECRET: string = String(process.env.REFRESH_TOKEN_SECRET)

const ACCESS_TOKEN_EXPIRATION: string = String(process.env.ACCESS_TOKEN_EXPIRATION)

const REFRESH_TOKEN_EXPIRATION: string = String(process.env.REFRESH_TOKEN_EXPIRATION)

// file upload
const MAX_FILE_SIZE: number = Number(process.env.MAX_FILE_SIZE || 0)

//google oauth
const GOOGLE_CLIENT_ID: string = String(process.env.GOOGLE_CLIENT_ID)
const GOOGLE_CLIENT_SECRET: string = String(process.env.GOOGLE_CLIENT_SECRET)

//STRIPE
const STRIPE_SECRET_KEY: string = String(process.env.STRIPE_SECRET_KEY)
const STRIPE_WEBHOOK_ENDPOINT_SECRET: string = String(process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET)

//CLOUDINARY
const CLOUDINARY_CLOUD_NAME: string = String(process.env.CLOUDINARY_CLOUD_NAME)
const CLOUDINARY_API_KEY: string = String(process.env.CLOUDINARY_API_KEY)
const CLOUDINARY_API_SECRET: string =  String(process.env.CLOUDINARY_API_SECRET)


export {
    PORT, DB_LINK, CLIENT_URL, SERVER_URL, 
    ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, 
    ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION,
    MAX_FILE_SIZE, GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_ID, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_ENDPOINT_SECRET,
    CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
}