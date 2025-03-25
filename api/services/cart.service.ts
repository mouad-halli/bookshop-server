import {Schema} from "mongoose"
import Cart from "../models/cart"

const deleteCart = async (ownerId: Schema.Types.ObjectId) => {
    try {
        await Cart.deleteOne({owner: ownerId})
    } catch (error) {
        throw(error)
    }
}

export = {
    deleteCart    
}