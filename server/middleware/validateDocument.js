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
        message: 'Please enter the title of your document.',
        error: 'MissingTitleError'
      });
    return;
  }
  if (typeof title !== 'string') {
    res.status(400)
      .json({
        message: 'Please enter a title with two or more non-whitespace characters.',
        error: 'InvalidTitleError'
      });
    return;
  }
  const strippedTitle = title.replace(/(\s+)/, '');
  if (strippedTitle.length < 2) {
    res.status(400)
      .json({
        message: 'Please enter a title with two or more non-whitespace characters.',
        error: 'InvalidTitleError'
      });
    return;
  }

  const content = reqBody.content;
  if (!content) {
    res.status(400)
      .json({
        message: 'Please enter the content of your document.',
        error: 'MissingContentError'
      });
    return;
  }
  if (typeof content !== 'string') {
    res.status(400)
      .json({
        message: 'Please enter a document content with two or more non-whitespace characters.',
        error: 'InvalidContentError'
      });
    return;
  }
  const strippedContent = content.replace(/(\s+)/, '');
  if (strippedContent.length < 2) {
    res.status(400)
      .json({
        message: 'Please enter a document content with two or more non-whitespace characters.',
        error: 'InvalidContentError'
      });
    return;
  }

  const access = reqBody.access;
  if (!access) {
    res.status(400)
      .json({
        message: 'Please enter an access type of \'public\', \'private\' or \'role\' for your document.',
        error: 'MissingAccessError'
      });
    return;
  }
  const loweredAccess = access.toLowerCase();
  if (typeof loweredAccess !== 'string') {
    res.status(400)
      .json({
        message: 'Please enter an access type of \'public\', \'private\' or \'role\' for your document.',
        error: 'InvalidAccessError'
      });
    return;
  }
  if (!isValidAccessType(loweredAccess)) {
    res.status(400)
      .json({
        message: 'Please enter an access type of \'public\', \'private\' or \'role\' for your document.',
        error: 'InvalidAccessError'
      });
    return;
  }

  const categories = reqBody.categories;
  if (!categories) {
    res.status(400)
      .json({
        message: 'Please enter the categories of your document.',
        error: 'MissingCategoriesError'
      });
    return;
  }
  if (typeof categories !== 'string') {
    res.status(400)
      .json({
        message: 'Please enter categories with two or more non-whitespace characters.',
        error: 'InvalidCategoriesError'
      });
    return;
  }
  const strippedCategories = categories.replace(/(\s+)/, '');
  if (strippedCategories.length < 2) {
    res.status(400)
      .json({
        message: 'Please enter categories with two or more non-whitespace characters.',
        error: 'InvalidCategoriesError'
      });
    return;
  }

  const tags = reqBody.tags;
  if (!tags) {
    res.status(400)
      .json({
        message: 'Please enter the tags of your document.',
        error: 'MissingTagsError'
      });
    return;
  }
  if (typeof tags !== 'string') {
    res.status(400)
      .json({
        message: 'Please enter tags with two or more non-whitespace characters.',
        error: 'InvalidTagsError'
      });
    return;
  }
  const strippedTags = tags.replace(/(\s+)/, '');
  if (strippedTags.length < 2) {
    res.status(400)
      .json({
        message: 'Please enter tags with two or more non-whitespace characters.',
        error: 'InvalidTagsError'
      });
    return;
  }

  next();
}
