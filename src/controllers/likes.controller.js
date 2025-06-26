import { Likes } from "../models/likes.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const likeToggleToComment = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        throw new ApiError(400, "Please provide comment to like");
    }

    const like = await Likes.findOne({
        comment: id,
        likedBy: req.user?._id,
    });
    let msg;
    if (like) {
        await Likes.findByIdAndDelete(like._id);
        msg = "Unliked successfully";
    } else {
        await Likes.create({
            comment: id,
            likedBy: req.user?._id,
        });
        msg = "Liked successfully";
    }
    const totalLike = await Likes.find({
        comment: id,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { likes: totalLike.length }, msg));
});

const likeToggleToVideo = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { id } = req.body;

    if (!id) {
        throw new ApiError(400, "Please provide video to like");
    }

    const like = await Likes.findOne({
        video: id,
        likedBy: req.user?._id,
    });

    let msg;

    if (like) {
        await Likes.findByIdAndDelete(like._id);
        msg = "Unliked successfully";
    } else {
        await Likes.create({
            video: id,
            likedBy: req.user?._id,
        });
        msg = "Liked successfully";
    }

    const totalLike = await Likes.find({
        video: id,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { likes: totalLike.length }, msg));
});

const likeToggleToTweet = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        throw new ApiError(400, "Please provide tweet to like");
    }

    const like = await Likes.findOne({
        tweet: id,
        likedBy: req.user?._id,
    });
    let msg;
    if (like) {
        await Likes.findByIdAndDelete(like._id);
        msg = "Unliked successfully";
    } else {
        await Likes.create({
            tweet: id,
            likedBy: req.user?._id,
        });
        msg = "Liked successfully";
    }
    const totalLike = await Likes.find({
        tweet: id,
    });
    return res
        .status(200)
        .json(new ApiResponse(200, { likes: totalLike.length }, msg));
});

export { likeToggleToComment, likeToggleToTweet, likeToggleToVideo };
