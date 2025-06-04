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

//routes declaration

import userRouter from "./routes/user.routes.js";
app.use("/api/users", userRouter);

import videoRouter from "./routes/video.routes.js";
app.use("/api/videos", videoRouter);

import tweetRouter from "./routes/tweet.routes.js";
app.use("/api/tweet", tweetRouter);

import subscriptionRouter from "./routes/subscription.routes.js";
app.use("/api/subscription", subscriptionRouter);

import playlistRouter from "./routes/playlist.routes.js";
app.use("/api/playlist", playlistRouter);

import likeRouter from "./routes/likes.routes.js";
app.use("/api/like", likeRouter);

import commentRouter from "./routes/comment.routes.js";
app.use("/api/comment", commentRouter);

export default app;
