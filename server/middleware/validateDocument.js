import isValidAccessType from '../util/isValidAccessType';

/**
 * Validates a document that is to be created or updated.
 * @param {Request} req - An express Request object with data about the
 * original HTTP request.
 * @param {Response} res - An express Response object with the info this app
 * will send back to the user e.g error messages like MissingTitleError,
 * InvalidContentError etc.
 * @param {Function} next - The next function or middleware in the callback stack
 * of express.
 * @return {void}
 */
export default function validateDocument(req, res, next) {
  const reqBody = req.body;

  const title = reqBody.title;
  if (!title) {
    res.status(400)
      .json({
        error: 'MissingTitleError'
      });
    return;
  }
  if (typeof title !== 'string') {
    res.status(400)
      .json({
        error: 'InvalidTitleError'
      });
    return;
  }
  const strippedTitle = title.replace(/\s/, '');
  if (strippedTitle.length < 1) {
    res.status(400)
      .json({
        error: 'InvalidTitleError'
      });
    return;
  }

  const content = reqBody.content;
  if (!content) {
    res.status(400)
      .json({
        error: 'MissingContentError'
      });
    return;
  }
  if (typeof content !== 'string') {
    res.status(400)
      .json({
        error: 'InvalidContentError'
      });
    return;
  }
  const strippedContent = content.replace(/\s/, '');
  if (strippedContent.length < 1) {
    res.status(400)
      .json({
        error: 'InvalidContentError'
      });
    return;
  }

  const access = reqBody.access.toLowerCase();
  if (!access) {
    res.status(400)
      .json({
        error: 'MissingAccessError'
      });
    return;
  }
  if (typeof access !== 'string') {
    res.status(400)
      .json({
        error: 'InvalidAccessError'
      });
    return;
  }
  if (!isValidAccessType(access)) {
    res.status(400)
      .json({
        error: 'InvalidAccessError'
      });
    return;
  }

  const categories = reqBody.categories;
  if (!categories) {
    res.status(400)
      .json({
        error: 'MissingCategoriesError'
      });
    return;
  }
  if (typeof categories !== 'string') {
    res.status(400)
      .json({
        error: 'InvalidCategoriesError'
      });
    return;
  }
  const strippedCategories = categories.replace(/\s/, '');
  if (strippedCategories.length < 1) {
    res.status(400)
      .json({
        error: 'InvalidCategoriesError'
      });
    return;
  }

  const tags = reqBody.tags;
  if (!tags) {
    res.status(400)
      .json({
        error: 'MissingTagsError'
      });
    return;
  }
  if (typeof tags !== 'string') {
    res.status(400)
      .json({
        error: 'InvalidTagsError'
      });
    return;
  }
  const strippedTags = tags.replace(/\s/, '');
  if (strippedTags.length < 1) {
    res.status(400)
      .json({
        error: 'InvalidTagsError'
      });
    return;
  }

  next();
}
