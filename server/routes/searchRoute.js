import express from 'express';

import SearchController from '../controllers/SearchController';
import validateToken from '../middleware/validateToken';

const searchRouter = express.Router();
searchRouter.route('/users')
  .get(validateToken, SearchController.searchUsers);

searchRouter.route('/documents')
  .get(validateToken, SearchController.searchDocuments);

export default searchRouter;
