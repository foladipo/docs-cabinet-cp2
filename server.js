import dotenv from 'dotenv';
import app from './server/app';

dotenv.config();
const port = process.env.PORT || 5000;

// TODO: Do we need to import initSequelize and run sequelize.sync() first?
app.listen(port, () => {
  console.log('Node app is running on port', port);
});
