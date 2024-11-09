import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
username:{
    type:String,
    required:true,
    unique:true,
    lowetCase:true,
    trim:true,
    index:true
},
email:{
    type:String,
    required:true,
    unique:true,
    lowetCase:true,
    trim:true,
},
fullname:{
    type:String,
    required:true,
    trim:true,
    index:true
},
avatar:{
    type:String, // claudinary url
    required:true,
},
coverImage:{
    type:String, // claudinary url
},
watchHistory:{
    type: Schema.Types.ObjectId,
    ref:'Vedio'
},
password:{
    type:String,
    required:[true,'password is required']
},
refreshToken:{
    type:String
}
},{timestamps:true})


userSchema.pre("save", async function (next) {
    if(!this.ismodified("password")) return next();
    this.password=await bcrypt.hash(this.password,10)
    next()
})
userSchema.method.isPasswordCorrect= async function 
(password) {
   return await bcrypt.compare(password,this.password)
}
userSchema.method.generateAccesToken= function() {
    return jwt.sign(
        {
            _id:this._id,
            email :this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresin:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.method.generateRefressToken = function () {
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresin:process.env.REFRESH_TOKEN_EXPIRY
        })
    }
    
    
export const User =mongoose.model("User",userSchema)