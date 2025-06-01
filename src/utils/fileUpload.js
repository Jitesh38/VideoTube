import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const uploadOnCloud = async (path) => {
    try {
        if (!path) return null;

        const uploadResult = await cloudinary.uploader
            .upload(path, { resource_type: "auto" })
            .catch((error) => {
                console.log(error);
            });
        // console.log('File Uploaded successfully : ', uploadResult);
        fs.unlinkSync(path); // * remove the locally save tamperory file . if upload fails
        return uploadResult.url;
    } catch (error) {
        fs.unlinkSync(path); // * remove the locally save tamperory file . if upload fails
        return null;
    }
};

export { uploadOnCloud };

// // Optimize delivery by resizing and applying auto-format and auto-quality
// const optimizeUrl = cloudinary.url('shoes', {
//     fetch_format: 'auto',
//     quality: 'auto'
// });

// console.log(optimizeUrl);

// // Transform the image: auto-crop to square aspect_ratio
// const autoCropUrl = cloudinary.url('shoes', {
//     crop: 'auto',
//     gravity: 'auto',
//     width: 500,
//     height: 500,
// });

// console.log(autoCropUrl);
