import dotenv from 'dotenv';
import app from './server/app';

dotenv.config();
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log('Node app is running on port', port);
});
