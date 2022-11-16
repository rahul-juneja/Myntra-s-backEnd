import Joi from "joi"
import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import bcrypt from "bcrypt";
import JwtService from "../../services/JwtService";
import { REFRESH_TOKEN } from "../../config";

const loginController = {
    // ASYNC Function
    async login(req, res, next){
        // Created a schema to get the values from FORM
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            pass: Joi.string().pattern(new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[$@$!%*?&]).{8,30})')).required(),
        });

        // Check the validation of the schema
        const { error } = loginSchema.validate(req.body);

        // IF error comes throw the error in ERROR Handler to show validation is wrong
        if (error){
            return next(error)
        }
        // Getting the values all the values from the body
        const {email, pass} = req.body
        let access_token, refresh_token;
        // After Validation we have to check the email and pass from DB
        try {
            // Find One is the mongoDB function to find the email in DB
            const user = await User.findOne({ email: email})
            console.log(user)
            // IF not then tell that email or password doesn't exists
            if (!user){
                return next(CustomErrorHandler.wrongCredentials("Email is wrong or doesn't exists."));
            }
            // console.log(user)
            const match = await bcrypt.compare(pass, user.password)
            if (!match){
                return next(CustomErrorHandler.wrongCredentials("Password is InCorrect!"));
            }

            // Token Genration
            access_token = JwtService.sign({_id: user._id,_role: user.role})
            // Refresh Token
            refresh_token = JwtService.sign({_id: user._id,_role: user.role}, '1y', REFRESH_TOKEN)
            
            await RefreshToken.create({token: refresh_token})



        } catch (err) {
            return next(err)
        }
        res.json({access_token, refresh_token})
    },
    async logout(req, res, next){
        const loginSchema = Joi.object({
            refresh_token: Joi.string().required(),
        });

        console.log(req.user._id);

        // Check the validation of the schema
        const { error } = loginSchema.validate(req.body);

        // IF error comes throw the error in ERROR Handler to show validation is wrong
        if (error){
            return next(error)
        }
        try{
            await RefreshToken.deleteOne({token: req.body.refresh_token})
            await User.deleteOne({_id: req.user._id})
        }catch(err){
            return next(new Error("Something went wrong in DB."))
        }




        res.json({messsage: "Logout Successfully"});
    }
}
export default loginController