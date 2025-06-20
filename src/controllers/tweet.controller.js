import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Please enter content to add tweet.");
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user?._id,
    });

    if (!tweet) {
        throw new ApiError(500, "Try after some time.");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, tweet, "Tweet added successfully."));
});

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.body;

    if(!tweetId){
        throw new ApiError(400,'Please provide tweet to delete')
    }

    const tweet = await Tweet.findByIdAndDelete(tweetId);

    if(!tweet){
        throw new ApiError(400,'Please provide appropriate tweet to delete')
    }

    return res.status(200).json(new ApiResponse(200,tweet,'Tweet deleted successfully'))

})

export { addTweet,deleteTweet };
