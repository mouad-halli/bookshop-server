import { model, Schema } from "mongoose";
import { IAddress } from "../types/address";

const addressSchema = new Schema<IAddress>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User", required: true
    },
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    zipCode: {
        type: Number,
        required: true
    }
})

export default model<IAddress>('Address', addressSchema)