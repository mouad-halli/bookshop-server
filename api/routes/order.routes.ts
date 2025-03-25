import { Router } from "express";
import { verifyAuthentication } from "../middlewares/verifyAccessToken.middleware";
import OrderController from '../controllers/order.controller'
const router = Router()

/* ROUTES:
    - seller:
        - get orders
        - update order status
        - update order shipping status
    - customer:
        - get orders
        - create orders
*/

// customer
router.post('/checkout', verifyAuthentication, OrderController.checkout)

router.get('/customer', verifyAuthentication, OrderController.getCustomerOrders)

// seller
router.get('/seller', verifyAuthentication, OrderController.getSellerOrders)

export default router