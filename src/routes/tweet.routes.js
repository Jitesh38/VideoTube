import { Router } from "express";
import {
    addTweet,
    deleteTweet,
    showTweet,
} from "../controllers/tweet.controller.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/")
    .get(varifyJWT, showTweet)
    .post(varifyJWT, addTweet)
    .delete(varifyJWT, deleteTweet);

export default router;
