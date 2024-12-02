import { asyncHandler } from "../utils/asyncHandler";
import {ApiError} from ".../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {jwt, verify} from "jsonwebtoken";
import mongoose from "mongoose";


const  generateAccessAndResfreshToken=async(userId)=>
    {
        try {
            const user=await User.findById(userId)
            const accessToken= user.generateAccesToken()
            const refreshToken=user.generateRefressToken()

            user.refreshToken= refreshToken
            await user.save({validateBeforeSave:false})

            return {accessToken, refreshToken}
        } catch (error) {
            throw new ApiError(500,"Somthing went wrong  while generating the refresh ans access token")
        }
}

const registerUser = asyncHandler (async ( req, res) =>{
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
const existedUser = await User.findOne({
    $or:[{usernam},{email}]

})
if (existedUser) {
    throw new ApiError(409,"User with email or usernane already exists")
}
console.log(req.files);

const avatarLocalPath = req.files?.avatar[0]?.path;
// const coverImageLocalPath = req.files?.coverImage[0]?.path;

let coverImageLocalPath;
if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath= leq.files.coverImage[0].path
}

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
const loginUser =asyncHandler(async ( req, res) =>{
// req body ->data
// email or username
// find the users
// password check
// access or refresh token
// send cookie
const {email,username,password}=req.body
console.log(email)

if (!username && !email) {
    throw new ApiError(400,"username or email is required")
}
const user =await User.findOne({
    $or:[{username}, {email}]
})
if (!user) {
    throw new ApiError(404,"User does not exixts")
}
const isPasswordValid= await user.isPasswordCorrect(password)
if (!isPasswordValid) {
    throw new ApiError(401,"Invalied user credentials")
}
const {access , refreshToken}= await generateAccessAndResfreshToken(user._Id)

const loggedInUser = await User.findById(user._Id).select("-password -refreshToken")

const options={
    httpOnly:true,
    Secure:true
}
return res
.status(200)
.cookie("accessToken",accessToken,Option)
.cookie("refreshToken", refreshToken,Option)
.json(
    new ApiResponse(
        200,
        {
            user:loggedInUser,accessToken,refreshToken
        },
        "User logged is Successfully"
    )
)
})
const logoutUser =asyncHandler(async(req, res)=>{
    await User.findbyIdAndUpdate(
        req.user._Id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        Secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",Option)
    .clearCookie("refreshToken",Option)
    .json(new ApiResponse(200,{},"User logged Out"))
})
const RefreshAccessToken =asyncHandler(async(req, res)=>
    {
const incomingRefreshToken= req.cookie.refreshToken || req.cookie.refreshToken
if (!incomingRefreshToken) {
    throw new ApiError(401,"unauthorised request")
}
try {
    const decodedToken= jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )
    const user = User.findById(decodedToken?._Id)
    if (!user) {
        throw new ApiError(401,"invalid refress token")
    }
    if (incomingRefreshToken !==user?.refreshToken) {
        throw new ApiError(401,"Refress token is expired or used")
    }
    const options={
        httpOnly:true,
        Secure:true
    }
    const {accessToken,newRefressToken}= await generateAccessAndResfreshToken(user._Id)
    return res
    .status(200)
    .cookie("accessToken",accessToken,Option)
    .cookie("refressToken",newRefressToken,Option)
    .json(
        new ApiResponse(
            200,
            {accessToken,refreshToken:newRefressToken},
            "acccess token refreshed"
        )
    )
} catch (error) {
    throw new ApiError(401,error?.message || "invalid refresh token")
}
})
const changeCurrentPassword = asyncHandler(async(req, res) =>{

    const {oldPassword, newPasswod} = req.body

    const user = await User.findById(req.user?._Id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    
    if (!isPasswordCorrect) {
      throw new ApiError(400,"invalid old password")
    }
    user.password= newpassword
         await user.save({validateBeforeSave:true})
})
return res
.status(200)
.json(new ApiResponse(200,{},"password changed successfully"))

const getCurrentUser = asyncHandler(async(req, res) =>{
    return res.status(200).json(new ApiResponse(200,{},"Current user fetched successfully"))
})
const updateaccountDetails = asyncHandler(async(req, res) =>{
    const {fullname , email} = req.body

    if (!fullname || !email) {
        throw new ApiError(400,"All fields are required")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._Id,
        {
            $set:{
                fullname : fullname,
                email : email
            }
        },
    {new:true}
    .select("-password")
    )
    return res
    .status(200)
    .json(new ApiResponse(200, user,"Updated account details successfully"))
})
const updatedUserAvatar =asyncHandler(async(req ,res) =>{
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400,"avatar file is missing")
    }
    const avatar= await uploadOnCloudinary(avatarLocalPath)
    if (!avatar.url) {
        throw new ApiError(400,"Error while uploding on avatar")
    }
    const user = User.findByIdAndUpdate(
        req.user?._Id,
    {
        $set:{
            avatar : avatar.url
        }
    },
{new :true}).select("-password")

return res
.status(200)
.json(new ApiResponse(200, user, "avatar updated successfully"))
})
const updatedUserCoverImage =asyncHandler(async(req ,res) =>{
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        throw new ApiError(400,"cover image file is missing")
    }
    const coverImage= await uploadOnCloudinary(coverImageLocalPath)
    if (!coverImage.url) {
        throw new ApiError(400,"Error while uploding on cover image")
    }
    const user = User.findByIdAndUpdate(
        req.user?._Id,
    {
        $set:{
            coverImage : coverImage.url
        }
    },
{new :true}).select("-password")

return res
.status(200)
.json(new ApiResponse(200, user, "cover image updated successfully"))
})

const getUserChannelProfile =asyncHandler(async(req, res) =>{
    const {username} = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }
    const channel = await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"subcriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subcribers"
            }
        },
        {
            $lookup:{
                from:"subcriptions",
                localField:"_id",
                foreignField:"Subcriber",
                as:"subcribedTo"
            }
        },
        {
            $addFields:{
                subcribersCount:{
                    $size: "$subscribers"
                },
                channelSubscribedToCount:{
                    $size:"$subscribedTo"
                },
                isSubscribed:{
                    $cond:{
                        if:{$in: [req.user?._Id, "$subscribers.subscriber"]},
                        then:true,
                        else:false
                    }
                }
            }
        },
        {
            $project:{
                fullname:1,
                username:1,
                subcribersCount:1,
                channelSubscribedToCount:1,
                isSubscribed:1,
                avatar:1,
                coverImage:1,
                email:1
            }
        }
    ])
    if (!channel?.length) {
        throw new ApiError(404,"Channel does not existes")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched succussfully")
    )
})

const getWatchHistory = asyncHandler(async(req, res) =>{
    const user = await User.Aggregate([
        {
            $match:{
                _Id: new mongoose.Types.ObjectId(req.user._Id)
            }
        },
        {
            $lookup:{
                from:"vedios",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        username:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first:"owner"
                            }
                        }
                    }
                ]
            },
        }
    ])
})
return res
.status(200)
.json(new ApiResponse(
    200, 
    user[0].watchHistory,
    "watch history fetched successfully"))
export {
    registerUser,
    loginUser,
    logoutUser,
    RefreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateaccountDetails,
    updatedUserAvatar,
    updatedUserCoverImage,
    getWatchHistory
}