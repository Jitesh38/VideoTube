import { Comment } from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Post request
const addComment = asyncHandler(async (req, res) => {
    // const { videoId } = req.params;
    const { content , videoId } = req.body;

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user?._id,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment added successfully."));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.body;
    const comment = await Comment.findByIdAndDelete(commentId);

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment deleted successfully."));
});

export { addComment, deleteComment };
