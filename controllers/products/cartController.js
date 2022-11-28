import { ObjectID } from "bson"
import Joi from "joi"
import {Cart} from "../../models"
import CustomErrorHandler from "../../services/CustomErrorHandler"

const cartController = {
    async addtoCart(req, res, next) {
        const cartSchema = Joi.object({
            userId: Joi.string().required(),
            productId: Joi.string().required(),
            quantity: Joi.number(),
            size: Joi.string().required(),
        })
        // console.log(">>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<")
        const { error } = cartSchema.validate(req.body)

        if (error) {
            return next(error)
        }
        const {userId, productId, quantity, size} = req.body
        const exists = await Cart.findOne({
            userId: userId,
            productId: productId,
            size: size
        })
        let cart
        if(exists){
            // console.log("here")
            // console.log(exists)
            try{
                cart = await Cart.updateOne(
                    {userId: userId,productId: productId},
                    {
                        $set: {quantity: exists.quantity+1}
                    }
                )
                const qty = exists.quantity + 1
                console.log("POST /cart/add 200")
                console.log("Quantity ++")
                return res.json({
                    message: "Product already exists and its quantity has been updated",
                    qty: qty
            })
            }
            catch(err){
                next(new Error("There is some error with the DataBase...!"))
            }
        }
        cart = new Cart({
            userId,
            productId,
            quantity,
            size
        })
        // console.log(cart)
        let success
        try {
            success = await cart.save()
            // console.log(success)
            res.json({success})
        } catch (err) {
            next(err)
        }
        console.log("POST /cart/add 200")
        console.log("New Item Added..!")



    },
    async showCart(req, res, next){
        // console.log("Came to Cart Page")
        const {userId} = req.body
        // console.log(userId)
        // console.log(ObjectID(userId))
        // const cart = await Cart.find({userId})
        const result = await Cart.aggregate([
            {
                $lookup:{
                    from: "Products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product_details"
                },
            },
            {
                $match:{
                    userId: ObjectID(userId)
                }
            }
        ])
        // console.log(result)
        console.log("Get /cart 200")
        res.json({result})
    },
    async delProduct(req, res, next){
        // console.log("Deleted Product")
        const {userId, productId, size} = req.body
        // console.log(userId)
        // console.log(productId)
        // console.log(size)
        try{
            const exist = await Cart.findOne({userId: userId, productId: productId, size: size})
            // console.log(exist)
            if (!exist){
                return next(CustomErrorHandler.notFound("Product Doesn't exists in Cart."))
            }
            const delete_product = await Cart.deleteOne({userId: userId, productId: productId, size: size})
            if (!delete_product){
                return next(new Error("Something is wrong with the DB."))
            }
            console.log("Post /cart/delete 200")
            res.json({message:"Product Removed Successfully....!!"})
        }catch(err){
            return next(err)
        }
        
        // console.log(result)
        // res.json({result})
    }
}



export default cartController