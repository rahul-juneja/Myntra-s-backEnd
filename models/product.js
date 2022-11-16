import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {type: String, required: true},
    des: {type: String, required: true},
    price: {type: Number, default:0, required: true},
    discount: {type: Number, default:0, required: true},
    rating: {type: Number, default: 0, required: true}
}, {timestamps: true})

export default mongoose.model("Product", productSchema, "Products")