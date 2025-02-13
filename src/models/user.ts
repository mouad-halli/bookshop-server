import { Schema, model } from "mongoose";
import { IUser } from "../types/user";

const UserSchema = new Schema<IUser>({

    firstname: { type: String },

    lastname: { type: String },

    email: { type: String, unique: true },

    imgUrl: { type: String, default: null },

    isSeller: { type: Boolean, default: false },
    
    password: { type: String, select: false },

    accessToken: { type: String, select: false },

    refreshToken: { type: String, select: false },

    googleId: { type: String, select: false },

    books: [{ type: Schema.Types.ObjectId, ref: 'Book', select: false }]

} )

export default model<IUser>('User', UserSchema)