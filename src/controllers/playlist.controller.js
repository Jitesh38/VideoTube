import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import mongoose from "mongoose";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description, videoId } = req.body;

    if (!name && !videoId) {
        throw new ApiError(400, "All feilds are required.");
    }

    const playlist = await Playlist.create({
        name,
        description: description || "",
        owner: req.user?._id,
    });

    let convertedVideoId = Array.from(videoId.split(","));

    convertedVideoId.map((id) => {
        let newId = new mongoose.Types.ObjectId(id);
        playlist.videos.push(newId);
    });

    await playlist.save();

    return res
        .status(201)
        .json(new ApiResponse(201, playlist, "Playlist created successfully."));
});

const addVideo = asyncHandler(async (req, res) => {
    const { videoId, name } = req.body;

    const playlist = await Playlist.findOne({
        owner: req.user?._id,
        name: name,
    });

    console.log("Playlist found :: ", playlist);

    if (!playlist) {
        throw new ApiError(
            400,
            "Invalid user request. Please provide valid playlist"
        );
    }

    let convertedVideoId = Array.from(videoId.split(","));

    convertedVideoId.map((id) => {
        let newId = new mongoose.Types.ObjectId(id);
        playlist.videos.push(newId);
    });

    // playlist.videos.push(convertedVideoId);
    await playlist.save();

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                playlist,
                "Video added successfully to playlist."
            )
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

    playlist.videos = playlist.videos.filter((video) => {
        return !video.equals(new mongoose.Types.ObjectId(videoId));
    });
    await playlist.save();

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Video deleted successfully."));
});

const showPlaylists = asyncHandler(async (req, res) => {
    console.log("Req body ::", req.body);

    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: req.user?._id,
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $project: {
                            thumbnail: 1,
                        },
                    },
                ],
            },
        },
    ]);

    return res.json(
        new ApiResponse(200, playlists, "Plaists fetched successfully.")
    );
});

const showOnePlaylist = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const playlists = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id),
                owner: req.user._id,
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
            },
        },
    ]);
    console.log("Playlist is ", playlists);

    return res.json(
        new ApiResponse(200, playlists[0], "Plaists fetched successfully.myyyy")
    );
});
export {
    createPlaylist,
    addVideo,
    deleteVideo,
    showPlaylists,
    showOnePlaylist,
};
