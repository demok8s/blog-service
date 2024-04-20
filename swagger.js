// swagger.js

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog Service API',
      version: '1.0.0',
      description: 'API documentation for the Blog Service',
    },
    servers: [
      {
        url: 'http://localhost:3001', // Change this to your server URL
        description: 'Local development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
