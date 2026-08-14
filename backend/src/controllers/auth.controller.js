import User from "../models/User.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Resend } from 'resend';
import "dotenv/config"
import { sendWelcomeEmail } from "../emails/emailHandler.js";


export const signup = asyncHandler(async (req,res)=>{

    const resend = new Resend(process.env.EMAIL_API_KEY)
    const {FullName, Email, Password} = req.body;
    if (!FullName || !Email || !Password) {
      throw new ApiError(400, "All fields are required");
    }
    if(typeof(Password) !== "string") throw new ApiError(400, "Wrong password format, enter a string")
    if (Password.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters");
    }

    // check if email is valid: regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      throw new ApiError(400, "Invalid email format");
    }

    const user = await User.findOne({Email})
    if(user) throw new ApiError(400,"User already exists")

    const newUser = new User({
        FullName : FullName,
        Email:Email,
        Password: Password
    })

    await newUser.save();
    const token = await newUser.generate_token();
    res.cookie("jwtUser",token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks: cross-site scripting
    sameSite: "strict", // CSRF attacks
    secure: process.env.NODE_ENV === "development" ? false : true,
    });
    await sendWelcomeEmail(newUser.Email, newUser.FullName,process.env.CLIENT_URL)
    return res.status(200).json(
        new ApiResponse(200,newUser,"User singed up")
    )

})

export default {
    signup
}