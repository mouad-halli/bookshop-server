import { Schema, model } from "mongoose";
import { IBook } from "../types/book";
import { GENRES, LANGUAGES } from "../types/enums/book";

const BookSchema = new Schema<IBook>({
    title: { type: String },
    author: { type: String },
    description: { type: String },
    genre: { type: String, enum: GENRES },
    bookLanguage: { type: String, enum: LANGUAGES },
    price: { type: Number },
    year: { type: Number },
    seller: { type: Schema.Types.ObjectId, ref: 'User' },
})

export default model<IBook>('Book', BookSchema)