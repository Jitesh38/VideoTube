import { Router } from "express";
import {
    letSubscribe,
    letUnSubscribe,
} from "../controllers/subscription.controller.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/")
    .post(varifyJWT, letSubscribe)
    .delete(varifyJWT, letUnSubscribe);

export default router;
