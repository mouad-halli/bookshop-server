import { Schema, model } from "mongoose";
import { ICart, ICartItem } from "../types/cart";

const CartItemSchema = new Schema<ICartItem>({
    product: { type: Schema.Types.ObjectId, ref: 'Book' },
    quantity: { type: Number }
})

const CartItem = model<ICartItem>('CartItem', CartItemSchema)

const CartSchema = new Schema<ICart>({
    owner: { type: Schema.Types.ObjectId, ref: 'User', select: false },
    items: [CartItem]
})

export default model<ICart>('Cart', CartSchema)