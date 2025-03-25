import Joi from 'joi'
import { validator } from './validator'
import { EMAIL_REGEX, PASSWORD_REGEX, WORLD_CHARACTERS_REGEX } from "../constants/regex"

const registerSchema = Joi.object({  
    firstname: Joi.string().min(4)
    .regex(WORLD_CHARACTERS_REGEX)
    .max(35).required()
    .messages({
        "string.pattern.base": '"firstname" must only contain valid characters'
    }),
    lastname: Joi.string().min(4)
    .regex(WORLD_CHARACTERS_REGEX).max(35).required()
    .messages({
        "string.pattern.base": '"lastname" must only contain valid characters'
    }),
    email: Joi.string().
    regex(EMAIL_REGEX).required()
    .messages({
        "string.pattern.base": '"email" invalid'
    }),
    password: Joi.string().min(8).max(28).regex(PASSWORD_REGEX).required()
    .messages({
        "string.pattern.base": '"password" must contain min 8 characters, 1 symbol, 1 upercase, 1 lowercase and a number'
    }),
    passwordConfirmation: Joi.ref('password')
})

const LoginSchema = Joi.object({
    email: Joi.string().regex(EMAIL_REGEX).required()
    .messages({
        "string.pattern.base": '"email" invalid'
    }),
    password: Joi.string().regex(PASSWORD_REGEX).required()
    .messages({
        "string.pattern.base": '"password" invalid'
    }),
})

export const validateRegister = validator(registerSchema, { abortEarly: true })

export const validateLogin = validator(LoginSchema, { abortEarly: true })