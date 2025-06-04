import { Router } from "express";
import { varifyJWT } from "../middlewares/auth.middleware.js";
import {
    addComment,
    deleteComment,
} from "../controllers/comment.controller.js";

const router = Router();

router.route("/add").post(varifyJWT, addComment);
router.route("/delete").delete(varifyJWT, deleteComment);

export default router;
