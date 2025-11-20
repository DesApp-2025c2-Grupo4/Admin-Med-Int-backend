const swaggerJsdoc = require("swagger-jsdoc");
const PORT = process.env.PORT || 4000;

// Metadatos de la informacion de nuestra API

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Medicina Integral - Administración",
      version: "1.0.0",
      description:
        "API para gestionar afiliados, grupo familiar y prestadores con sus agendas.",
      contact: {
        name: "Developer",
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Servidor Local",
      },
    ],
  },
  apis: ["./src/docs/*.yml"],
};

const openapiSpecification = swaggerJsdoc(options);

module.exports = openapiSpecification;
