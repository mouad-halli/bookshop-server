import { Router } from "express";
import cartController from "../controllers/cart.controller";
import { verifyAuthentication } from "../middlewares/verifyAccessToken.middleware";

const router = Router()

router.get('/', verifyAuthentication, cartController.getCart)

//TO DO: -add query validation for book_id and quantity
router.put('/cart-item', verifyAuthentication, cartController.upsertCartItem)

router.put('/cart', verifyAuthentication, cartController.upsertCart)

export default router