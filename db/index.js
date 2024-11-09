import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB= async()=>{
    try {
        const connectioninstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST :${
            connectioninstance.connection.host
        }`);
    } catch (error) {
        console.log("MONGODB connected error",error)
        process.exit(1)
    }
}
export default connectDB