import { server } from "./app.js";
import { PORT, SERVER_URL } from "./config/config.js";
import { connectMongoDB } from "./config/mongodb.js";
import { logger } from "./utils/logger.js";

console.log("=== DevMatch Backend Starting ===");
console.log("Current directory:", process.cwd());
console.log("Node version:", process.version);

(async () => {
    try {
        console.log("=== Attempting MongoDB Connection ===");
        // Connection to mongodb
        await connectMongoDB();
        console.log("=== MongoDB Connected Successfully ===");
        
        // Connection to server
        server.listen(PORT, () => {
            console.log(`=== Server running on ${SERVER_URL} ===`);
            logger.info(`Server running on ${SERVER_URL}`);
        });
    } catch (error) {
        console.error("=== Fatal Error During Startup ===");
        console.error(error);
        process.exit(1);
    }
})(); 