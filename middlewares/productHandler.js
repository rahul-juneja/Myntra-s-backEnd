import CustomErrorHandler from "../services/CustomErrorHandler";

const product = (req, res, next) =>{
    const productHeader = req.headers.product
    // console.log(productHeader);
    if(!productHeader){
        next(CustomErrorHandler.unAuthorized())
    }
    const token = productHeader.split(' ')[1]
    console.log(token);
    next();

}
export default product