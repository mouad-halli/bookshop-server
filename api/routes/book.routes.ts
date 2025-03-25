import { Router } from "express";
import BookController from "../controllers/book.controller"
import { validateBody, validateQuery } from "../middlewares/validateBody.middleware";
import { ValidateCreateBook, ValidateUpdateBook } from "../validations/bookValidation";
import { verifyAuthentication } from '../middlewares/verifyAccessToken.middleware';
import { verifyUserIsSeller } from "../middlewares/verifyUserIsSeller.middleware";
import { validator } from "../validations/validator";
import Joi from "joi";
import multer from "multer";
import { multerOptions } from "../config/multer";

const router = Router()

const upload = multer({ storage: multer.memoryStorage() })

router.get('/search', BookController.searchBooks)
router.get('/:book_id', BookController.getBookById)


router.get('/last-added', validateQuery(validator(Joi.object().keys({
    books_limit: Joi.number().min(0).max(30).optional(),
}), { abortEarly: false })), BookController.getLastAddedBooks)


router.post('/', verifyAuthentication, verifyUserIsSeller, upload.single('image'), validateBody(ValidateCreateBook), BookController.createBook)

router.put('/:book_id', verifyAuthentication, verifyUserIsSeller, upload.single('image'), validateBody(ValidateUpdateBook), BookController.updateBook)

router.delete('/:book_id', verifyAuthentication, verifyUserIsSeller, BookController.deleteBook)

export default router