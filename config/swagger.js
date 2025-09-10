import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library Management System API",
      version: "1.0.0",
      description: "API documentation for the Library Management System",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  // Point to route files for annotations
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
