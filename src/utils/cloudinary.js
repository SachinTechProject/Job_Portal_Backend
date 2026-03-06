import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (localFilePath) => {
 
  try {
     
    if (!localFilePath) {
       console.log("could not found the localPath")
       throw new Error("Local file path not found");
    }console.log("this is the osseus", localFilePath)

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });
    console.log("this is ", response)

    console.log("this is cludneay response", response)
    console.log('File uplade successfully', response.url);
        console.log('File uplade successfully', response.secure_url);

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log("this is the cloudnary error", error) // remove the locally save temproy file as upload operation got faild
    return null;
  }
};



 export {uploadOnCloudinary}