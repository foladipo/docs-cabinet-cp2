import express from 'express';

import documentsRoute from './documentsRoute';
import searchRoute from './searchRoute';
import usersRoute from './usersRoute';

const indexRoute = express();

indexRoute.use('/documents', documentsRoute);
indexRoute.use('/search', searchRoute);
indexRoute.use('/users', usersRoute);
indexRoute.use('*', (req, res) => {
  res.status(200)
    .json({
      message: 'Welcome to Docs Cabinet. File away!'
    });
});

export default indexRoute;
