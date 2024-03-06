import { Schema, model } from "mongoose";
import { ICart } from "../types/cart";

const CartSchema = new Schema<ICart>({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [{ type: Schema.Types.ObjectId, ref: 'Book' }]
})

export default model<ICart>('Cart', CartSchema)