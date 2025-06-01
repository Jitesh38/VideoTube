import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from '../middlewares/multer.middleware.js'
import { varifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

// we can write middlewares in routes like this - calling it before main function
router.route('/register').post(
    //this is middleware
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1,

        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ])
    //this is main function
    , registerUser)


router.route('/login').post(loginUser);


// secure routes
router.route('/logout').post(varifyJWT, logoutUser);

router.route('/refresh-token').post(refreshAccessToken);


export default router;