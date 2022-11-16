import Joi from "joi"
import errorHandler from "../../middlewares/errorHandlers"
import { Product } from "../../models"
import JwtService from "../../services/JwtService"

const productController = {
    async addproducts(req, res, next){
        const addProductSchema = Joi.object({
            name: Joi.string().required(),
            des: Joi.string().required(),
            price: Joi.number().required(),
            discount: Joi.number().required(),
            rating: Joi.number().required()
        })

        const { error } = addProductSchema.validate(req.body)

        if (error){
            next(error)
        }

        const {name, des, price, discount, rating} = req.body
        const product = new Product({
            name,
            des,
            price,
            discount,
            rating
        })
        
        
        let access_token
        try {
            const result = await product.save()
            access_token = JwtService.sign({_id:result._id,name:result.name})

        } catch (error) {
            return next(error)
        }
        res.json({access_token})

    },
    async delproducts(req, res, next){
        
    },
    async showproducts(req, res, next){
        const products = Product.find("Products")
        console.log(products);
    }
}



export default productController