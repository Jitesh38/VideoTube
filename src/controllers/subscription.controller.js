import { Subscription } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const letSubscribe = asyncHandler(async (req, res) => {
    const { channelId } = req.body;

    const checkSubscribe = await Subscription.find({
        channel: channelId,
        subscriber: req.user._id,
    })

    if (checkSubscribe.length !== 0) {
        console.log(checkSubscribe);
        throw new ApiError(400, 'Already subscribed.')
    }

    const subscription = await Subscription.create({
        channel: channelId,
        subscriber: req.user._id,
    });

    if (!subscription) {
        throw new ApiError(500, "Internal server error.");
    }

    console.log("Object created :: ", subscription);

    return res
        .status(201)
        .json(new ApiResponse(201, subscription, "Subscribed successfully."));
});

const letUnSubscribe = asyncHandler(async (req, res) => {
    const { channelId } = req.body;

    const subscription = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user,
    });

    const unsubscribe = await Subscription.findByIdAndDelete(subscription._id);

    return res
        .status(200)
        .json(new ApiResponse(200, unsubscribe, "Unsubscribed successfully"));
});

export { letSubscribe, letUnSubscribe };
