import express, { NextFunction, Request, Response } from 'express'
import { CLIENT_URL, PORT, /*UPLOAD_LOCATION*/ } from './config/environment'
import cors from 'cors'
import { STATUS_CODES } from 'http'
import { connectToDatabase } from './config/database'
import userRoutes from './routes/user.routes'
import authenticationRoutes from './routes/authentication.routes'
import bookRoutes from './routes/book.routes'
import cartRoutes from './routes/cart.routes'
import cookieParser from 'cookie-parser'
import { Usertype } from './types/user'
import passport from 'passport'

declare module 'express-serve-static-core' {
    interface Request {
        user: Usertype
    }
}

const { INTERNAL_SERVER_ERROR } = STATUS_CODES

const app = express()

app.use(cors({
	credentials: true,
	origin: CLIENT_URL
}))

app.use(cookieParser())

app.use(express.json())

app.use(passport.initialize())

// app.get('/uploads/:file', (req, res) => {
// 	res.sendFile(req.params.file, {root: UPLOAD_LOCATION})
// })

app.use('/user', userRoutes)
app.use('/authentication', authenticationRoutes)
app.use('/book', bookRoutes)
app.use('/cart', cartRoutes)

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
	const errorStatus = error.status || 500
	const errorMessage = error.message || INTERNAL_SERVER_ERROR

	return res.status(errorStatus).json({
		message: errorMessage,
	})
})

app.listen(PORT, () => {
	console.log(`server listening on port ${PORT}`)
	connectToDatabase()
})

process.on('uncaughtException', () => {})