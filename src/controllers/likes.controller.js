import { Likes } from "../models/likes.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const likeToggleToComment = asyncHandler(async (req, res) => {
    const { commentId } = req.body;

    if (!commentId) {
        throw new ApiError(400, "Please provide comment to like");
    }

    const like = await Likes.findOne({
        comment: commentId,
        likedBy: req.user?._id,
    });

    if (like) {
        const unlike = await Likes.findByIdAndDelete(like._id);
        return res
            .status(200)
            .json(
                new ApiResponse(200, unlike, "Unliked comment successfully")
            );
    } else {
        const like = await Likes.create({
            comment: commentId,
            likedBy: req.user?._id,
        });

        console.log("Object created :: ", like);

        return res
            .status(201)
            .json(new ApiResponse(201, like, "Comment liked successfully"));
    }
});

const likeToggleToVideo = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { videoId } = req.body;

    if (!videoId) {
        throw new ApiError(400, "Please provide video to like");
    }

    const like = await Likes.findOne({
        video: videoId,
        likedBy: req.user?._id,
    });

    if (like) {
        const unlike = await Likes.findByIdAndDelete(like._id);
         const totalLike = await Likes.find({
            video:videoId
        })
        return res
            .status(200)
            .json(new ApiResponse(200, {likes:totalLike.length}, "Unliked video successfully"));
    } else {
        const like = await Likes.create({
            video: videoId,
            likedBy: req.user?._id,
        });

        const totalLike = await Likes.find({
            video:videoId
        })

        console.log("Object created :: ", like);

        return res
            .status(201)
            .json(new ApiResponse(201, {likes:totalLike.length}, "Video liked successfully"));
    }
});
const likeToggleToTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.body;

    if (!tweetId) {
        throw new ApiError(400, "Please provide tweet to like");
    }

    const like = await Likes.findOne({
        tweet: tweetId,
        likedBy: req.user?._id,
    });
    if (like) {
        const unlike = await Likes.findByIdAndDelete(like._id);
        return res
            .status(200)
            .json(new ApiResponse(200, unlike, "Unliked tweet successfully."));
    } else {
        const like = await Likes.create({
            tweet: tweetId,
            likedBy: req.user?._id,
        });

        console.log("Object created :: ", like);

        return res
            .status(201)
            .json(new ApiResponse(201, like, "Tweet liked successfully"));
    }
});

export { likeToggleToComment, likeToggleToTweet, likeToggleToVideo };
