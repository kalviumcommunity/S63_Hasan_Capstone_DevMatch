import { AsyncHandler, ErrorHandler } from "../utils/handlers.js";
import { UserModel } from "../models/user.model.js";
import { JWT_SECRET } from "../config/config.js";
import jwt from "jsonwebtoken";

export const userAuth = AsyncHandler(async (req, _res, next) => {
    // Get token from request cookies
    const { devmatchToken } = req.cookies;

    // Validation of token
    if (!devmatchToken) {
        throw new ErrorHandler("Please login to continue", 401);
    }

    // Decode the token
    const decodedPayload = jwt.verify(devmatchToken, JWT_SECRET);

    // Get the user details
    const user = await UserModel.findById(decodedPayload._id);
    if (!user) {
        throw new ErrorHandler("User does not exists", 404);
    }

    // Pass the decoded payload and user details
    req.decoded = decodedPayload;
    req.user = user;

    // Move to next handler function
    next();
}); 