import express from "express";
import { loginController, refreshController, registerController, userController } from "../controllers";
import productController from "../controllers/products/productController";
import auth from "../middlewares/authHandler";
import product from "../middlewares/productHandler";

const router = express.Router();

router.post('/register', registerController.register)
router.post('/login', loginController.login)
router.get('/user',auth, userController.user)
router.post('/refreshtoken',refreshController.refresh)
router.post('/logout', auth, loginController.logout)

router.post ('/product/add', productController.addproducts)
router.get('/products/', product, productController.showproducts)


export default router;