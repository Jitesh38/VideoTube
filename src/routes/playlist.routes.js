import { Router } from "express";
import { createPlaylist, addVideo, deleteVideo } from "../controllers/playlist.controller.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route('/create').post(varifyJWT,createPlaylist);
router.route('/add-video').post(varifyJWT,addVideo);
router.route('/delete-video').delete(varifyJWT,deleteVideo);

export default router;

