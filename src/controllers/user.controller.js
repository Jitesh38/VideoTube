import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { deleteOnCloud, uploadOnCloud } from "../utils/fileUpload.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong. while generating tokens"
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exist : username , email
    // check for images
    // check for avtar
    // upload them on cloudinary , avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check user creation
    // return res

    console.log("Body of request :: ", req.body);

    const { username, email, fullname, password } = req.body;

    if (
        [username, email, fullname, password].some(
            (field) => field?.trim().length === 0
        )
    ) {
        throw new ApiError(400, "All fields are required and compulsory.");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        console.log("Existed user from mongodb", existedUser);
        throw new ApiError(409, "Username or email should be unique");
    }

    console.log("Request Files object :: ", req.files);

    //now this file is available on local server
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverimageLocalPath = req.files?.coverImage[0]?.path;

    // console.log("Localpath of avatar ::", avatarLocalPath);

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avtar is required");
    }
    if (!coverimageLocalPath) {
        throw new ApiError(400, "Cover image is required.");
    }

    const avatar = await uploadOnCloud(avatarLocalPath);
    const coverImage = await uploadOnCloud(coverimageLocalPath);

    console.log("Cloud Url of avatar :: ", avatar);

    if (!avatar) {
        throw new ApiError(400, "Error while uploading on cloud");
    }
    if (!coverImage) {
        throw new ApiError(400, "Error while uploading on cloud");
    }

    const user = await User.create({
        username,
        email,
        password,
        fullname,
        avatar:avatar.url,
        coverImage: coverImage.url || "",
    })
    
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Internal Server Error! try after some time!");
    }

    return res.status(201).json(new ApiResponse(200, createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    console.log("Email in Login : ", email);
    console.log("Username in Login : ", username);

    if (!email && !username) {
        throw new ApiError(400, "Username or Email required.");
    }

    // here is an alternative of above code based on logic discussion
    // if(!(username || email)){
    //     throw new ApiError(400,'Username or email is required.')
    // }

    const user = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (!user) {
        throw new ApiError(400, "Please first register to start.");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid user credentials.");
    }

    const { accessToken, refreshToken } = await generateAndRefreshTokens(
        user._id
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { accessToken, refreshToken }));
});

const logoutUser = asyncHandler(async (req, res) => { 
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
           new:true,
        }
    );
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, user, "User logout successfully."));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies?.refreshToken ||
        req.body?.refreshToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Unauthorized Access.");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Invalid Access");
        }

        const { accessToken, refreshToken } = await generateAndRefreshTokens(
            user._id
        );

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Refresh token refresed."
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message, "Something went wrong.");
    }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid Old Password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, ""));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { email, fullname } = req.body;

    if (!fullname || !email) {
        throw new ApiError(401, "All field are required.");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                email,
                fullname,
            },
        },
        {
            new: true,
        }
    ).select('-password -refreshToken');

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedUser,
                "User Details updated successfully."
            )
        );
});

// TODO: make same function for cover image also
const updateUserAvatar = asyncHandler(async (req, res) => {
    // * Since there is only one file we dont have to use array

    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Please upload files properly.");
    }

    // TODO: delete old picture from cloud
    const avatar = await uploadOnCloud(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Error while uploading on avatar.");
    }

    // delete previouse pic from the cloud.
    await deleteOnCloud(req.user?.avatar);

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar:avatar.url,
            },
        },
        {
            new: true,
        }
    ).select("-password");


    return res
        .status(201)
        .json(new ApiResponse(201, user, "Avatar updated successfully."));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username?.trim()) {
        throw new ApiError(400, "Username is missing.");
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username,
            },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers",
            },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo",
            },
        },
        {
            $addFields: {
                subscribersCount: {
                    // Use $ sign for fields
                    $size: "$subscribers",
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo",
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                },
            },
        },
        {
            $project: {
                username: 1,
                email: 1,
                fullname: 1,
                avatar: 1,
                coverImage: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1
            }
        }
    ]);

    console.log(channel);
    if (!channel?.length) {
        throw new ApiError(400, 'channel does not exist')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, channel[0], 'User channel fetched successfully.'));
});

const getWatchHistory = asyncHandler(async (req, res) => {

    // we get only string from mongodb , when we use _id 
    // mongoose internally convert this id to objectId of mongodb internally

    // but mongoose dont work in aggregation pipelines. so we have to convert id into objectId.
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup: {
                from: 'videos',
                localField: 'watchHistory',
                foreignField: '_id',
                as: 'watchHistory',
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'owner',
                            foreignField: '_id',
                            as: 'owner',
                            // TODO: do this pipeline outer this scope
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1

                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: '$owner'
                            }
                        }
                    }
                ]
            },

        }

    ]);


    return res.status(200).json(new ApiResponse(200, user[0].watchHistory, 'Watch history fetched successfully.'))
});


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    getUserChannelProfile,
    getWatchHistory
};
