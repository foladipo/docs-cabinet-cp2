import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

app.get('/api', (req, res) => {
  res.send('<h1>All clear</h1>');
});

app.listen(port, () => {
  console.log('Node app is running on port', port);
});
