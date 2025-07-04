import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

// we can replace res with _ , if it is not used
export const varifyJWT = asyncHandler(async (req, res, next) => {
    if (req.body) {
        console.log('Body in auth middleware :: ', req.body);
    }
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request. Please login to start.");
        }

        const decodedToken = jwt.verify(token, process.env.ACESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshtoken"
        );

        if (!user) {
            // TODO: discuss about frontend
            return res.json(new ApiError(401, "Invalid Access Token."));
        }
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
});
