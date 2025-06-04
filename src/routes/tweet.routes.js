import { Router } from "express";
import { addTweet } from "../controllers/tweet.controller.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/add').post(varifyJWT,addTweet);

export default router;