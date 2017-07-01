/**
 * Prevents users that are not at least admins from accessing some endpoints
 * or routes. If the user is not an admin, it returns a ForbiddenOperationError
 * response. Otherwise, it calls next().
 * @param {Request} req - An express Request object with data about the
 * original request sent to this endpoint e.g the profile of the user making
 * this request etc.
 * @param {Response} res - An express Response object with the info this app
 * will send back to the user e.g error messages like ForbiddenOperationError.
 * @param {Function} next - The next function or middleware in the callback stack
 * of express.
 * @return {void}
 */
export default function adminsOnly(req, res, next) {
  const user = req.decodedUserProfile;
  const roleId = user.roleId;
  if (roleId > 0) {
    next();
  } else {
    res.status(403)
      .json({
        message: 'Sorry, you\'re not permitted to perform this action.',
        error: 'ForbiddenOperationError'
      });
  }
}
