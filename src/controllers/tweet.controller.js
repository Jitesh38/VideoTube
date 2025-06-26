import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const showTweet = asyncHandler(async (req, res) => {

    const tweet = await Tweet.aggregate([
        {
            $lookup:{
                from:'users',
                localField:'owner',
                foreignField:'_id',
                as:'owner',
                pipeline:[
                    {
                        $project:{
                            fullname:1,
                            username:1,
                            avatar:1,
                            email:1,
                            _id:1
                        }
                    }
                ]
            }
        },
        {
            $lookup:{
                from:'likes',
                localField:'_id',
                foreignField:'tweet',
                as:'likes'
            }
        },
        {
            $addFields:{
                owner:{
                    $first:'$owner'
                },
                likes:{
                    $size:'$likes'
                },
                isOwner:{
                    $cond:{
                        if:{$in:[req.user?._id,"$owner._id"]},
                        then:true,
                        else:false
                    }
                }
            }
        }
    ])

    if (!tweet) {
        throw new ApiError(500, "No tweets yet!");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, tweet, "Tweet fetched successfully."));
});

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
    const { id } = req.body;

    if(!id){
        throw new ApiError(400,'Please provide tweet to delete')
    }

    const tweet = await Tweet.findByIdAndDelete(id);

    if(!tweet){
        throw new ApiError(400,'Please provide appropriate tweet to delete')
    }

    return res.status(200).json(new ApiResponse(200,tweet,'Tweet deleted successfully'))

})

export { showTweet, addTweet,deleteTweet };
