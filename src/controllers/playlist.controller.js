import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import mongoose from "mongoose";
const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        throw new ApiError(400, "Name is required.");
    }

    const playlist = await Playlist.create({
        name,
        description: description || "",
        owner: req.user?._id,
    });

    console.log(playlist);

    return res.status(201).json(new ApiResponse(201,playlist,'Playlist created successfully.'));
});

const addVideo = asyncHandler(async (req, res) => {
    const { videoId, name } = req.body;

    const playlist = await Playlist.findOne({
        owner: req.user?._id,
        name: name,
    });

    console.log("Playlist found :: ", playlist);

    if (!playlist) {
        throw new ApiError(400, "Invalid user request");
    }

    playlist.videos.push(videoId);
    await playlist.save();

    return res
        .status(201)
        .json(
            new ApiResponse(201, playlist, "Video added successfully to playlist.")
        );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId, name } = req.body;

    const playlist = await Playlist.findOne({
        owner: req.user?._id,
        name: name,
    });

    console.log("Playlist found :: ", playlist);

    if (!playlist) {
        throw new ApiError(400, "Invalid user request");
    }

    playlist.videos = playlist.videos.filter((video) =>{
        return !video.equals(new mongoose.Types.ObjectId(videoId))
    }
);
    await playlist.save();

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Video deleted successfully."));
});

export { createPlaylist, addVideo, deleteVideo };
