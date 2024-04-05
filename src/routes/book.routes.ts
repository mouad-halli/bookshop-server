import { Router } from "express";
import BookController from "../controllers/book.controller"
import { validateBody } from "../middlewares/validateBody.middleware";
import { ValidateCreateBook, ValidateUpdateeBook } from "../validations/bookValidation";

const router = Router()

router.get('book/:book_id', BookController.getBookById)

router.post('book', validateBody(ValidateCreateBook), BookController.createBook)
router.put('book/:book_id', validateBody(ValidateUpdateeBook), BookController.updateBook)
router.delete('book/:book_id', BookController.deleteBook)

export default router