import { Router } from "express";
import {
    likeToggleToComment, likeToggleToTweet, likeToggleToVideo,
} from "../controllers/likes.controller.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/video").post(varifyJWT, likeToggleToVideo);
router.route("/comment").post(varifyJWT, likeToggleToComment);
router.route("/tweet").post(varifyJWT, likeToggleToTweet);

export default router;