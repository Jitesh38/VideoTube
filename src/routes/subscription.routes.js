import { Router } from "express";
import {
    letSubscribe,
    letUnSubscribe,
} from "../controllers/subscription.controller.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/subscribe").post(varifyJWT, letSubscribe);
router.route("/unsubscribe").delete(varifyJWT, letUnSubscribe);

export default router;
