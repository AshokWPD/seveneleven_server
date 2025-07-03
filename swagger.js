const swaggerAutogen = require("swagger-autogen")();
const swaggerComponents = require("./swagger-components");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/config/config.json")[env];

const doc = {
  info: {
    title: "API Documentation",
    description: "Automated API documentation",
  },
  host: config.host,
  schemes: ["https", "http"],

  securityDefinitions: {
    BearerAuth: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description:
        "JWT Authorization header using the Bearer scheme. Example: 'Authorization: Bearer {token}'",
    },
  },
  security: [{ BearerAuth: [] }],
  tags: [
    {
      name: "User",
      description: "User management APIs",
    },
  ],
  ...swaggerComponents,
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./app.js");
});

//  {
//             "in": "body",
//             "name": "body",
//             "schema": {
//               "$ref": "#/components/schemas/Admin"
//             }
//           }
