import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';

import swaggerJson from './routes/swagger-json';
import swaggerUi from './routes/swagger-ui';
import indexRoute from './routes/';

dotenv.config();
const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/../client/dist')));
app.use(express.static(path.join(__dirname, '/../swaggerDocs')));

app.use('/api', indexRoute);
app.use('/docs', swaggerUi);
app.use('/swaggerjson', swaggerJson);

app.use('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

export default app;
