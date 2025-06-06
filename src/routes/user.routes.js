import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    getUserChannelProfile,
    updateWatchHistory,
    getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// we can write middlewares in routes like this - calling it before main function
router.route("/register").post(
    //this is middleware
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    //this is main function
    registerUser
);

router.route("/login").post(loginUser);

// secure routes
router.route("/logout").post(varifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(varifyJWT, changeCurrentPassword);
router.route("/current-user").get(varifyJWT, getCurrentUser);
router.route("/update-account").patch(varifyJWT, updateAccountDetails);
router
    .route("/avatar")
    .patch(varifyJWT, upload.single("avatar"), updateUserAvatar);

router.route("/c/:username").get(varifyJWT, getUserChannelProfile);
router.route("/watch-history").get(varifyJWT, getWatchHistory);
router.route("/watch-history").post(varifyJWT, updateWatchHistory);

export default router;
