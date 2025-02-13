import { NextFunction, Request, Response } from "express"
import { createError } from '../utils/error';
import { StatusCodes } from "http-status-codes";
const { FORBIDDEN } = StatusCodes

export const verifyUserIsSeller = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.user)
        next(createError(FORBIDDEN, "not authenticated"))

    if (!req.user.isSeller)
        next(createError(FORBIDDEN, "user is not seller"))
    
    next()

}