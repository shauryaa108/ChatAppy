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
        new ApiResponse(200,newUser,"User signed up")
    )

})

export const login = asyncHandler(async (req,res)=>{
  const {Email,Password} = req.body;
  const user = await User.findOne({Email : Email}).select("+Password");
  if(!user) throw new ApiError(500,"Invalid credentials");
  if(!user.isPasswordCorrect(Password)) throw new ApiError(500,"Invalid credentials");

  const tkn = await user.generate_token();
  res.cookie("jwtUser",tkn, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks: cross-site scripting
    sameSite: "strict", // CSRF attacks
    secure: process.env.NODE_ENV === "development" ? false : true,
    });
    res.status(200).json(
        new ApiResponse(200,user,"User logged in")
    )
})

// this logout is not correct, it should have user in res and then it should clear his cookies or any sort of authentication should be there
export const logout = (_,res)=>{
  res.cookie("jwtUser","",{maxAge:0});
  res.status(200).json(
    new ApiResponse(200,{},"Cookies cleared successfully")
  )
}

export const updateProfile = asyncHandler(async (req,res)=>{
    const {ProfilePic} = req.body;
    if(!ProfilePic) throw new ApiError(400,"Profile pic not available")
    const userId = req.user._id
    const uploadedResponse = await cloudinary.uploader.upload(ProfilePic)
    const updatedUser = await User.findByIdAndUpdate(userId,{ProfilePic : uploadedResponse.secureUrl},{new:true});
    res.status(200).json(
      new ApiResponse(300,updatedUser,"User profile updated successfully")
    )
})
