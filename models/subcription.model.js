import mongoose, {Schema} from "mongoose";

const subcriptionSchema = new Schema ({
        Subcriber:{
            type: Schema.Types.ObjectId, //one who is subcribing 
            ref:"User"
        },
        channel:{
            type: Schema.Types.ObjectId, //one to whom 'subscriber' is subcribing 
            ref:"User"
        }
},{timestamps:true})

export const Subcription = mongoose.model("Subcription", subcriptionSchema)