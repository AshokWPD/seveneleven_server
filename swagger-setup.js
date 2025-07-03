const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Automated API documentation",
    },
    servers: [
      {
        url: "https://www.bookypo.com/", // Change this to your server URL
        description: "Production server",
      },
      {
        url: "http://localhost:4560", // Change this to your server URL
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["username", "type"],
          properties: {
            username: { type: "string", example: "Ashok" },
            userEmail: {
              type: "string",
              format: "email",
              example: "ashok@gmail.com",
            },
            type: { type: "integer", example: 1 },
            isAllowed: { type: "boolean", example: true },
            phoneNumber: { type: "string", example: "1234567890" },
            gender: { type: "string", example: "male" },
            age: { type: "integer", example: 23 },
            profileImg: {
              type: "string",
              example: "https://example.com/image.jpg",
            },
            history: { type: "string", example: "" },
            location: { type: "string", example: "Thiruvarur" },
            latitude: { type: "number", format: "float", example: 40.7128 },
            longitude: { type: "number", format: "float", example: -74.006 },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ["./routes/*.js"], // Path to your API routes
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  // Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // JSON endpoint
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

module.exports = setupSwagger;
