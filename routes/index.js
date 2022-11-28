import express from "express";
import { cartController, loginController, refreshController, registerController} from "../controllers";
import productController from "../controllers/products/productController";
import auth from "../middlewares/authHandler";
import product from "../middlewares/productHandler";

const router = express.Router();

router.post('/register', registerController.register)
router.post('/login', loginController.login)
router.get('/user',auth, loginController.user)
router.post('/refreshtoken',refreshController.refresh)
router.post('/logout', auth, loginController.logout)
router.post('/user/delete', registerController.delete)

router.post ('/product/add', productController.addproducts)
router.get('/products/', productController.showproducts)
router.get('/products/:category', productController.showproducts)
router.get('/products/:category/:_id', productController.productinfo)


router.post('/cart', cartController.showCart)
router.post('/cart/add', cartController.addtoCart)
router.post('/cart/delete', cartController.delProduct)



export default router;