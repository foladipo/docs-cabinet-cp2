import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';

import indexRoute from './routes/';

dotenv.config();
const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/../client/dist')));

app.use('/api', indexRoute);

app.use('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

export default app;
