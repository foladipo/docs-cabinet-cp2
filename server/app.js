import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.get('/api', (req, res) => {
  res.json({ message: 'Hello world!' });
});

export default app;
