import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import users from './controllers/users';
import documents from './controllers/documents';
import search from './controllers/search';

dotenv.config();
const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/../client/dist')));

app.use('/api/users', users);
app.use('/api/documents', documents);
app.use('/api/search', search);

app.use('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

export default app;
