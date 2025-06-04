import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

// for accepting json response
app.use(express.json({ limit: "16kb" }));

// for accepting response from url
app.use(urlencoded({ extended: true, limit: "16kb" }));

// for static file
app.use(express.static("public"));

// for cookies crud
app.use(cookieParser());

//routes
import userRouter from "./routes/user.routes.js";
import videoRouter from './routes/video.routes.js'

//routes declaration

// all routes for user 
app.use("/api/users", userRouter);

// all routes for videos
app.use("/api/videos", videoRouter);

export default app;