import express from 'express';

import DocumentsController from '../controllers/DocumentsController';
import validateToken from '../middleware/validateToken';

const documentsRouter = express.Router();
documentsRouter.route('/')
  .get(validateToken, DocumentsController.getAllDocuments)
  .post(validateToken, DocumentsController.createDocument);

documentsRouter.route('/:id')
  .get(validateToken, DocumentsController.getDocument)
  .put(validateToken, DocumentsController.updateDocument)
  .delete(validateToken, DocumentsController.deleteDocument);

export default documentsRouter;
