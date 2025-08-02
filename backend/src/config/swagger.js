// src/config/swagger.js
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "DevMatch API",
            version: "1.0.0",
            description: "DevMatch - Connect with fellow developers",
            contact: {
                name: "API Support"
            }
        }
    },
    apis: ["./src/docs/*.js"]
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

// Export a function to plug into the Express app
export const setupSwagger = (app) => {
    app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}; 