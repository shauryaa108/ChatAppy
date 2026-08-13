import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import ApiError from '../utils/apiError';

const UserSchema = new mongoose.Schema({
    FullName : {
        type:String,
        required:true
    },
    Email : {
        type:String,
        required:true,
        unique:true
    },
    Password : {
        type:String,
        required:true,
        select:false
    },
    ProfilePic : {
        type : String,
        default : ""
    }
});

UserSchema.pre("save",async function(){
    if(!this.isModified("Password")) return;
    this.Password = await bcrypt.hash(this.Password,10)
})

UserSchema.methods.isPasswordCorrect = async function(Password){
    return await bcrypt.compare(Password,this.Password)
}

UserSchema.methods.generate_token = async function(){
    if(!process.env.JWT_SECRET) throw new ApiError(400, "JWT_SECRET not configured")
    return jwt.sign({
        _id:this._id,
        Fullname : this.FullName,
        Email: this.Email
    },
    process.env.JWT_SECRET,
    {
        expiresIn : process.env.JWT_EXPIRY
    }
)
}

const User = mongoose.model("User" , UserSchema)
export default User