import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.port || 5000;

const router = express.Router();

const host = process.env.NODE_ENV === 'production'
  ? 'docs-cabinet-cp2-staging.herokuapp.com'
  : `localhost:${port}`;

const swaggerDefinition = {
  info: {
    title: 'Docs Cabinet',
    version: '0.0.1',
    description: 'Documentation for the Docs Cabinet RESTful API using Swagger',
  },
  host,
  basePath: '/'
};

const options = {
  swaggerDefinition,
  apis: [
    './server/routes/documentsRoute.js',
    './server/routes/searchRoute.js',
    './server/routes/usersRoute.js'
  ]
};

const swaggerSpec = swaggerJSDoc(options);

router.route('/')
  .all((req, res) => {
    res.send(swaggerSpec);
  });

export default router;
