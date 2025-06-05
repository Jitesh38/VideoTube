import { Router } from "express";
import { addTweet,deleteTweet } from "../controllers/tweet.controller.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/add').post(varifyJWT,addTweet);
router.route('/delete').delete(varifyJWT,deleteTweet);

export default router;