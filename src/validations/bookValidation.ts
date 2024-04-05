import { number, object, string } from 'joi';
import { GENRES, LANGUAGES } from '../types/enums/book';
import { validator } from './validator';

const createBookSchema = object({
    title: string().required(),
    author: string().required(),
    description: string().required(),
    genre: string().required().valid(...Object.values(GENRES)),
    language: string().required().valid(...Object.values(LANGUAGES)),
    price: number().min(0).required(),
    year: number().min(1).integer().required()
})

const updateeBookSchema = object({
    title: string(),
    author: string(),
    description: string(),
    genre: string().valid(...Object.values(GENRES)),
    language: string().valid(...Object.values(LANGUAGES)),
    price: number().min(0),
    year: number().min(1).integer()
})

export const ValidateCreateBook = validator(createBookSchema, { abortEarly: false })
export const ValidateUpdateeBook = validator(updateeBookSchema, { abortEarly: false })
