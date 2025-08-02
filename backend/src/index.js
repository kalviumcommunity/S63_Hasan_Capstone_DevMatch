import { server } from "./app.js";
import { PORT, SERVER_URL } from "./config/config.js";
import { connectMongoDB } from "./config/mongodb.js";
import { logger } from "./utils/logger.js";

(async () => {
    // Connection to mongodb
    await connectMongoDB();
    // Connection to server
    server.listen(PORT, () => {
        logger.info(`Server running on ${SERVER_URL}`);
    });
})(); 