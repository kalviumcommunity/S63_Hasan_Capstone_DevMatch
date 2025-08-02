import "dotenv/config";

export const NODE_ENV = process.env.NODE_ENV,
    SERVER_URL = process.env.SERVER_URL,
    PORT = process.env.PORT,
    MONGODB_URL = process.env.MONGODB_URL,
    JWT_SECRET = process.env.JWT_SECRET,
    FRONTEND_URL = process.env.FRONTEND_URL;

// Debug: Log environment variables (without sensitive info)
console.log("Environment variables loaded:");
console.log("NODE_ENV:", NODE_ENV);
console.log("PORT:", PORT);
console.log("MONGODB_URL:", MONGODB_URL ? "SET" : "NOT SET");
console.log("JWT_SECRET:", JWT_SECRET ? "SET" : "NOT SET");
console.log("FRONTEND_URL:", FRONTEND_URL); 