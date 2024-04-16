import { Router } from "express";
import BookController from "../controllers/book.controller"
import { validateBody } from "../middlewares/validateBody.middleware";
import { ValidateCreateBook, ValidateUpdateeBook } from "../validations/bookValidation";
import { verifyAuthentication } from '../middlewares/verifyAccessToken.middleware';

const router = Router()

router.get('/:book_id', BookController.getBookById)

router.post('/', verifyAuthentication, validateBody(ValidateCreateBook), BookController.createBook)

router.put('/:book_id', verifyAuthentication, validateBody(ValidateUpdateeBook), BookController.updateBook)

router.delete('/:book_id', verifyAuthentication, BookController.deleteBook)

export default router