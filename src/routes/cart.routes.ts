import { Router } from "express";
import cartController from "../controllers/cart.controller";
import { verifyAuthentication } from "../middlewares/verifyAccessToken.middleware";

const router = Router()

router.get('/', /*verifyAuthentication,*/ cartController.getCart)
router.post('/', /*verifyAuthentication,*/ cartController.updateCart)

export default router