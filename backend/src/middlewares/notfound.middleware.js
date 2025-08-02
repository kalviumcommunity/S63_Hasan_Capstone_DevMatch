// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const notfoundMiddleware = (_req, res, _next) => {
    // Return the response
    res.status(404).json({
        success: false,
        message: "Oops! Route not found"
    });
}; 