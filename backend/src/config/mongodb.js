import mongoose from "mongoose";
import { MONGODB_URL } from "../config/config.js";
import { logger } from "../utils/logger.js";

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
        logger.info("MongoDB is connected successfully");
    } catch (err) {
        if (err instanceof Error) {
            logger.error("Error while connecting to mongodb:", err.message);
        }
        process.exit(1);
    }
}; 