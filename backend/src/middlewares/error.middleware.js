import { ErrorHandler } from "../utils/handlers.js";
import { ValidationError } from "yup";
import { logger } from "../utils/logger.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (err, _req, res, _next) => {
    // Log all errors
    console.error(err);
    logger.error(err.message);

    // Set default error values
    err.message ||= "Internal Server Error Occurred";
    err.statusCode ||= 500;

    // Yup validation error
    if (err instanceof ValidationError) {
        const message = [];
        if (err.errors.length > 1) {
            err.errors.forEach((e) => {
                message.push(e);
            });

            res.status(400).json({
                success: false,
                message
            });
        } else {
            err = new ErrorHandler(err.errors[0], 400);
        }
    }

    // Return the response
    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
}; 