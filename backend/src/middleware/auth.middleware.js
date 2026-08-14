import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'
import 'dotenv/config'
import ApiError from '../utils/apiError.js'


export const auth_user = async (req,res,next)=>{
    try {
        const token = req.cookies.jwtUser
        if(!token) throw new ApiError(401,"Unauthorised request : No tokens provided");
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        if(!decodedToken)throw new ApiError(401,"Unauthorised request : Incorrect token provided");
        const user = await User.findById(decodedToken._id)
        if(!user) throw new ApiError(401,"User not found");
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(400,"Something went wrong while validating user")
    }
}