import { Likes } from "../models/likes.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addLikeToComment = asyncHandler(async (req, res) => {
    const { commentId } = req.body;

    if (!commentId) {
        throw new ApiError(400, "Invalid comment ID.");
    }

    const like = await Likes.create({
        comment: commentId,
        likedBy: req.user?._id,
    });

    console.log("Object created :: ", like);

    return res
        .status(201)
        .json(new ApiResponse(201, like, "liked successfully"));
});

const addLikeToVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.body;

    if (!videoId) {
        throw new ApiError(400, "Invalid video ID.");
    }

    const like = await Likes.create({
        video: videoId,
        likedBy: req.user?._id,
    });

    console.log("Object created :: ", like);

    return res
        .status(201)
        .json(new ApiResponse(201, like, "liked successfully"));
});
const addLikeToTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.body;

    if (!tweetId) {
        throw new ApiError(400, "Invalid tweet ID.");
    }

    const like = await Likes.create({
        tweet: tweetId,
        likedBy: req.user?._id,
    });

    console.log("Object created :: ", like);

    return res
        .status(201)
        .json(new ApiResponse(201, like, "liked successfully"));
});

export { addLikeToComment, addLikeToTweet, addLikeToVideo };
