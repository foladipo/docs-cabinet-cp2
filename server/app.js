import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.get('/api', (req, res) => {
  res.send('<h1>All clear</h1>');
});

export default app;
