import Joi from "joi";
import {
    RefreshToken,
    User
} from "../../models";
import bcrypt from 'bcrypt';
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtService from "../../services/JwtService";
import { REFRESH_TOKEN } from "../../config";


const registerController = {
    async register(req, res, next) {
        // Main Logic


        // Validation
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            pass: Joi.string().pattern(new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[$@$!%*?&]).{8,30})')).required(),
            repass: Joi.ref('pass')
        });
        console.log(req.body)
        const { error } = registerSchema.validate(req.body);

        if (error) {
            return next(error);
        } else {
            // Check for Existing Email Address 
            try {
                const exist = await User.exists({
                    email: req.body.email
                });
                if (exist) {
                    return next(CustomErrorHandler.alreadyExist('This email is already taken.'));
                }
            } catch (err) {
                return next(err);
            }
            // Save the Fields in the MongoDB
            const { name, email, pass } = req.body;
            // Password Hashing
            const hasedPass = await bcrypt.hash(pass, 10);

            const user = new User({
                name,
                email,
                password: hasedPass
            })
            let access_token;
            let refresh_token;
            try {
                const result = await user.save();
                // JWT Token
                access_token = JwtService.sign({ _id: result._id, _role: result.role })
                // Refresh Token
                refresh_token = JwtService.sign({ _id: result._id, _role: result.role }, '1y', REFRESH_TOKEN)

                await RefreshToken.create({ token: refresh_token })
            } catch (err) {
                return next(err)
            }
            // Displaying the Access Token in frontEnd
            // Displaying the Refresh Token in frontEnd
            res.json({ access_token, refresh_token })
        }
    },
    async delete(req, res, next){
        const deleteSchema = Joi.object({
            token: Joi.string().required()
        })
        const { error } = deleteSchema.validate(req.body)
        if(error){
            return next(error)
        }
        try{
            const refreshtoken = await RefreshToken.findOne({
                token: req.body.token
            })

            if (!refreshtoken){
                return next(CustomErrorHandler.unAuthorized("Invalid Refresh Token."))
            }
            let userID
            try{
                const { _id } = await JwtService.verify(refreshtoken.token, REFRESH_TOKEN)
                userID = _id
                console.log(userID)
            }catch(err){
                return next(CustomErrorHandler.unAuthorized("Invalid Refresh Token."))
            }

            const user = await User.deleteOne({_id: userID})
            if(!user){
                return next(CustomErrorHandler.unAuthorized("User Not Found"))
            }
            res.json({message: "User Deleted Successfully."})
        }catch(err){
            next(err)
        }



    }
}

export default registerController;