import mongoose from "mongoose";

const Schema = mongoose.Schema

const cartSchema = new Schema({
    userId: {type: mongoose.Types.ObjectId, ref:"Users"},
    productId: {type:mongoose.Types.ObjectId, ref:"Products"},
    quantity: {type: Number, default: 1},
    size: {type: String, required: true},
})

export default mongoose.model('Cart', cartSchema, 'Carts')