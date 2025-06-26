import { Comment } from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Post request
const addComment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content  } = req.body;

    const createdComment = await Comment.create({
        content,
        video: id,
        owner: req.user?._id,
    });

    const comment = await Comment.aggregate([
        {
            $match:{
                _id:createdComment._id
            }
        },
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
                foreignField:'video',
                as:'likes',
                pipeline:[
                    {
                        $project:{
                            _id:1
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                owner:{
                    $first:"$owner"
                },
                likes:{
                    $size:'$likes'
                }
            }
        }
    ])

    return res
        .status(201)
        .json(new ApiResponse(201, comment[0], "Comment added successfully."));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.body;
    const comment = await Comment.findByIdAndDelete(commentId);

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment deleted successfully."));
});

export { addComment, deleteComment };
