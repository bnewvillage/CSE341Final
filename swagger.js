const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Tasker API',
    description: 'This API will manage tasks, projects, users, and comments.'
  },
  host: 'localhost:3000'
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);