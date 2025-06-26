import { Router } from "express";
import { createPlaylist, addVideo, deleteVideo, showPlaylists, showOnePlaylist} from "../controllers/playlist.controller.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route('/create').post(varifyJWT, createPlaylist);

router.route('/')
    .get(varifyJWT,showPlaylists)
    .post(varifyJWT, addVideo)
    .delete(varifyJWT, deleteVideo);

router.route('/v/:id')
    .get(varifyJWT,showOnePlaylist)
    

export default router;

