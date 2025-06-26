import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
    uploadVideo,
    updateVideo,
    deleteVideo,
    getVideoToShow,
    getMyFeed
} from "../controllers/video.controller.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/upload").post(
    varifyJWT,
    upload.fields([
        {
            name: "video",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),
    uploadVideo
);

router.route("/s/:videoId").get(varifyJWT, getVideoToShow).delete(varifyJWT, deleteVideo);;

router.route("/feed").get(varifyJWT, getMyFeed);

router.route("/update-video/:videoId").patch(varifyJWT, updateVideo);

export default router;
