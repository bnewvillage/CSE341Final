const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Tasker API',
    description: 'This API will manage tasks, projects, users, and comments.'
  },
  host: 'cse341final-mzat.onrender.com',
  schemes: 'https'
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);