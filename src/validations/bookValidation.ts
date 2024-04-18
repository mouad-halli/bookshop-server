import Joi from 'joi';
import { GENRES, LANGUAGES } from '../types/enums/book';
import { validator } from './validator';

const createBookSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    description: Joi.string().required(),
    genre: Joi.string().required().valid(...Object.values(GENRES)),
    bookLanguage: Joi.string().required().valid(...Object.values(LANGUAGES)),
    price: Joi.number().min(0).required(),
    year: Joi.number().min(1).integer().required()
})

const updateeBookSchema = Joi.object({
    title: Joi.string(),
    author: Joi.string(),
    description: Joi.string(),
    genre: Joi.string().valid(...Object.values(GENRES)),
    bookLanguage: Joi.string().valid(...Object.values(LANGUAGES)),
    price: Joi.number().min(0),
    year: Joi.number().min(1).integer()
})

export const ValidateCreateBook = validator(createBookSchema, { abortEarly: false })
export const ValidateUpdateeBook = validator(updateeBookSchema, { abortEarly: false })
