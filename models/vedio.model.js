import mongoose,{Schema} from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const vedioSchema = new Schema({
vedioFile:{
    type:String, // cloudinary url
    required:true
},
thumbnail:{
    type:String, // cloudinary url
    required:true
},
tital:{
    type:String,
    required:true
},
discription:{
    type:String,
    required:true
},
duration:{
    type:Number,
    required:true
},
veiws:{
    type:Number,
    default:0
},
ispublised:{
    type:Boolean,
    default:true
},
owner:{
type: Schema.Types.ObjectId,
ref:"User"
}
},{timestamps:true})


vedioSchema.plugin(mongooseAggregatePaginate)

export const Vedio= mongoose.model("Vedio",vedioSchema)