import { model, Schema } from 'mongoose';
import { ORDER_STATUS } from '../types/enums/order';
import { IOrder } from '../types/order';

const OrdersSchem = new Schema<IOrder>({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // seller: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    items: [{
        type: Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true
    }],
    status: { 
        type: String, 
        enum: ORDER_STATUS,
        default: 'pending' 
    },
    totalAmount: { 
        type: Number, 
        required: true 
    },
}, { timestamps: true })

export default model<IOrder>('Order', OrdersSchem)