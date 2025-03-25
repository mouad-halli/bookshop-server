import { Schema, model } from "mongoose";
import { IBook } from "../types/book";
import { GENRES, LANGUAGES } from "../types/enums/book";

const BookSchema = new Schema<IBook>({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    genre: { type: String, enum: GENRES },
    bookLanguage: { type: String, enum: LANGUAGES },
    price: { type: Number },
    year: { type: Number },
    seller: { type: Schema.Types.ObjectId, ref: 'User' },
    stockCount: { type: Number },
    imageUrl: {type: String, default: null }
})

BookSchema.index(
    {
        title: 'text',
        author: 'text',
        description: 'text',
        genre: 'text'
    },
    {
        name: 'book_search_index',
        weights: {
            title: 10,
            author: 7,
            genre: 4,
            description: 1
        }
    }
)

export default model<IBook>('Book', BookSchema)