import { Router } from "express";
import {
    addLikeToComment,
    addLikeToTweet,
    addLikeToVideo,
} from "../controllers/likes.controller.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/video").post(varifyJWT, addLikeToVideo);
router.route("/comment").post(varifyJWT, addLikeToComment);
router.route("/tweet").post(varifyJWT, addLikeToTweet);

export default router;