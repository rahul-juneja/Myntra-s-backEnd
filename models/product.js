import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    second_image: {type: String, required: true},
    price: {type: Number, default:0, required: true},
    discount_price: {type: Number, default:0, required: true},
    discount_percentage: {type: Number, default:0, required: true},
    category: {type: String, enum:['men', 'women', 'kids'], required: true}
}, {timestamps: true})

export default mongoose.model("Product", productSchema, "Products")