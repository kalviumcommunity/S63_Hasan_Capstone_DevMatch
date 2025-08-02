import mongoose from "mongoose";
import { MONGODB_URL } from "../config/config.js";
import { logger } from "../utils/logger.js";

export const connectMongoDB = async () => {
    try {
        // Debug: Log the MongoDB URL (without sensitive info)
        const urlToLog = MONGODB_URL ? 
            MONGODB_URL.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : 
            'MONGODB_URL is undefined';
        logger.info("Attempting to connect to MongoDB:", urlToLog);
        
        if (!MONGODB_URL) {
            throw new Error("MONGODB_URL environment variable is not set");
        }
        
        await mongoose.connect(MONGODB_URL);
        logger.info("MongoDB is connected successfully");
    } catch (err) {
        if (err instanceof Error) {
            logger.error("Error while connecting to mongodb:", err.message);
            logger.error("Full error:", err);
        }
        process.exit(1);
    }
}; 