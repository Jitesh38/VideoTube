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
        return uploadResult;
    } catch (error) {
        // fs.unlinkSync(path); // * remove the locally save tamperory file . if upload fails
        return null;
    } finally {
        fs.unlinkSync(path); // * remove the locally save tamperory file . if upload fails
    }
};

// Delete previous image on cloud
const deleteOnCloud = async (url) => {
    let public_id = url.substring(
        url.lastIndexOf("/") + 1,
        url.lastIndexOf(".jpg") && url.lastIndexOf(".png")  && url.lastIndexOf(".jpeg") && url.lastIndexOf(".mp4") && url.lastIndexOf(".JPG")
    );
    console.log(public_id);

    const response = await cloudinary.uploader.destroy(public_id);

    console.log(response);

    return response
};

export { uploadOnCloud, deleteOnCloud };
