import express from 'express';
import path from 'path';

const swagger = express.Router();

swagger.route('/')
  .get((req, res) => {
    res.status(200)
      .sendFile(path.resolve('swaggerDocs', 'index.html'));
  });

export default swagger;
