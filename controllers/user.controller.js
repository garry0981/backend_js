import { asyncHandler } from "../utils/asyncHandler";
import {ApiError} from ".../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"


const registerUser = asyncHandler (async(req,res) =>{
res.status(200).json({
    message :"ok"
    // get user details from frontend
    // validation - not emplty
    // check if user already exists:username,email
    // check for images, check for avatar
    // upload them to cloudinary:avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check from user creation
    // return res
})
})
const {fullname, username, email, password} = req.body
console.log("email:", email);

if (
    [fullname, email, username, password].some((field) =>
    field?.trim() ==="")
) {
    throw new ApiError(400,"All fields are required")
}
const existedUser = User.findOne({
    $or:[{usernam},{email}]

})
if (existedUser) {
    throw new ApiError(409,"User with email or usernane already exists")
}
const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath = req.files?.coverImage[0]?.path;
if (!avatarLocalPath) {
    throw new ApiError(400,"Avatar file are required")
}
const avatar= await uploadOnCloudinary(avatarLocalPath)
const coverImage= await uploadOnCloudinary(coverImageLocalPath)
if (!avatar) {
    throw new ApiError(400,"Avatar file are required")
}
User.create({
fullname,
avatar:avatar.url,
coverImage:coverImage?.url ||"",
email,
password,
username:username.toLowerCase(),
})
const createdUser= await User.findById(user._Id).select(
"-password -refreshToken"
)
if (!createdUser) {
    throw new ApiError(500,"something went wrong while resistering the user")
}
return res.status(201).json(
    new ApiResponse(200,createdUser,"User resisted successfully")
)
export {
    registerUser,
}