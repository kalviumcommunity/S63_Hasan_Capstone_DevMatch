import { Router } from "express";
import { MONGODB_URL, NODE_ENV, PORT } from "../config/config.js";
import mongoose from "mongoose";

const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running"
    });
});

healthRouter.get("/debug", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Debug information",
        environment: {
            NODE_ENV: NODE_ENV,
            PORT: PORT,
            MONGODB_URL_SET: !!MONGODB_URL,
            MONGODB_CONNECTION_STATE: mongoose.connection.readyState
        }
    });
});

export default healthRouter; 