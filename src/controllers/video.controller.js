import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { deleteOnCloud, uploadOnCloud } from "../utils/fileUpload.js";
import mongoose from "mongoose";


// upload video 
const uploadVideo = asyncHandler(async (req, res) => {
    const { title, description, isPublished } = req.body;

    if (
        [title, description, isPublished].some(
            (field) => field?.trim()?.length === 0
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const videoLocalPath = req.files?.video[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if (!videoLocalPath && !thumbnailLocalPath) {
        throw new ApiError(400, "Please upload video or thumbnail of video");
    }

    console.log(videoLocalPath,thumbnailLocalPath);

    // const videoFile = await uploadOnCloud(videoLocalPath);
    // const thumbnail = await uploadOnCloud(thumbnailLocalPath);

    // if (!videoFile && !thumbnail) {
    //     throw new ApiError(401, "Error while uploading on cloud.");
    // }

    // console.log("This is video file :: ", videoFile);

    const video = await Video.create({
        videoFile: videoLocalPath,
        thumbnail: thumbnailLocalPath,
        // videoFile: videoFile.url,
        // thumbnail: thumbnail.url,
        title,
        description,
        isPublished,
        duration: videoLocalPath?.duration || 50,
        owner: req.user,
    });

    const createdVideo = await Video.findById(video._id);
    return res
        .status(200)
        .json(
            new ApiResponse(200, createdVideo, "Video uploaded successfully.")
        );
});

// get all user uploaded videos
const getUploadedVideo = asyncHandler(async (req, res) => {
    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user?.id),
            },
        },
    ]);

    console.log("Videos of the user :", videos);

    if (!videos) {
        throw new ApiError(400, "Please upload videos first");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully."));
});

// user can update information of the video
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description, isPublished } = req.body;

    // console.log(req);

    // console.log(videoId);

    if (
        [title, description, isPublished].some(
            (field) => field?.trim()?.length === 0
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                isPublished,
            },
        },
        {
            new: true,
        }
    );

    console.log("Updated Videos : ", video);

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video updated successfully."));
});

// delete video
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findByIdAndDelete(videoId);

    if (!video) {
        throw new ApiError(400, "Video is not found.");
    }

    // await deleteOnCloud(video.videoFile);
    // await deleteOnCloud(video.thumbnail);

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video deleted successfully."));
});

const getVideosToShow = ()=>{

    // const videos = await Video.aggregate()

}

export { uploadVideo, getUploadedVideo, updateVideo, deleteVideo, getVideosToShow };
