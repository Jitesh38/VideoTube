import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
    uploadVideo,
    getUploadedVideo,
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

router.route("/s/:videoId").get(varifyJWT, getVideoToShow);

router.route("/my-videos").get(varifyJWT, getUploadedVideo);

router.route("/feed").get(varifyJWT, getMyFeed);

router.route("/update-video/:videoId").patch(varifyJWT, updateVideo);

router.route("/delete-video/:videoId").delete(varifyJWT, deleteVideo);

export default router;
