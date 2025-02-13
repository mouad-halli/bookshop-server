import { model, Schema } from "mongoose";
import { ORDER_ITEM_STATUS } from "../types/enums/order";
import { IOrderItem } from "../types/order";

const OrderItemSchema = new Schema<IOrderItem>({
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        min: 1,
        required: true
    },
    unitPrice: {
        type: Number, 
        required: true
    },
    status: {
        type: String,
        enum: ORDER_ITEM_STATUS,
        default: 'pending'
    },
}, { timestamps: true })

export default model<IOrderItem>('OrderItem', OrderItemSchema)