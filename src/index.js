// require('dotenv').config({path:'./env'})
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config({ path: "./.env" });

/* First Approach but not recommended  - connecting db here
import mongoose from 'mongoose';
import DB_NAME from './constants'

(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on('error',(error)=>{
            console.log('Error : App is not talking with DB',error);
            throw error
        })
    } catch (error) {
        console.error(error)
    }
})()
*/

connectDB()
    .then(() => app.listen(process.env.PORT || 8000))
    .catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("this is running");
});