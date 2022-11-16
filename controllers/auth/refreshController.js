import Joi from "joi"
import { REFRESH_TOKEN } from "../../config"
import { RefreshToken, User } from "../../models"
import CustomErrorHandler from "../../services/CustomErrorHandler"
import JwtService from "../../services/JwtService"

const refreshController = {
    async refresh(req, res, next) {
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required()
        })
        const {
            error
        } = refreshSchema.validate(req.body)
        // Validate Refresh Token
        if (error) {
            return next(error)
        }
        let refreshtoken;
        // Check token exists
        try {
            refreshtoken = await RefreshToken.findOne({
                token: req.body.refresh_token
            })

            if (!refreshtoken) {
                return next(CustomErrorHandler.unAuthorized("Invalid Refresh Token"));
            }
            let userId;
            try {
                const { _id } = await JwtService.verify(refreshtoken.token,REFRESH_TOKEN);
                userId = _id;
                console.log(userId);
            } catch (err) {
                return next(CustomErrorHandler.unAuthorized("Invalid Refresh Token"));
            }

            const user = await User.findOne({_id: userId});
            console.log(user)
            if (!user){
                return next(CustomErrorHandler.unAuthorized("No User Found!"))
            }

            // New Tokens
            let access_token = JwtService.sign({_id: user._id, role: user.role})
            let refresh_token = JwtService.sign({_id: user.id, role: user.role}, '1y', REFRESH_TOKEN)

            await RefreshToken.create({token: refresh_token});
            res.json({access_token, refresh_token});


        } catch (err) {
            return next(new Error("Something went wrong" + err.message))
        }
    }
}

export default refreshController