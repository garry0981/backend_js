import {v2 as cloudinary} from "cloudinary"
import fs, { unlinkSync } from "fs"

import {v2 as cloudinary} from 'cloudinary';
import { fileURLToPath } from "url";
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:process.env.CLOUDINARY_API_KEY , 
  api_secret:process.env.CLOUDINARY_API_SECRET  
});
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null
    // upload the file on Cloudinary
    const response= await cloudinary.uploader.upload
    (localFilePath,{
      resource_type:"auto"
    })
    // file has been uploaded sucessfuly
    // console.log("file is upload on cloudinary",resource.url);
    fs.unlinkSync(localFilePath)
    return response;
    
  } catch (error) {
    fs.unlinkSync(localFilePath) 
    //remove the locally saved tomporary file as the upload opration got failed
    return null;
  }
}

// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//     { public_id: "olympic_flag" }, 
//     function(error, result) {console.log(result); });

export{uploadOnCloudinary}