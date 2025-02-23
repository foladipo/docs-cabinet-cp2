/**
 * RestrictAccess
 * @desc Contains methods that restrict access to a route or resource.
 */
export default class RestrictAccess {
  /**
   * Prevents users that are not at least admins from accessing some
   * endpoints or routes. If the user is not an admin, it returns
   * a ForbiddenOperationError response. Otherwise, it calls next().
   * @param {Request} req - An express Request object with data about
   * the original request sent to this endpoint e.g the profile of the
   * user making this request etc.
   * @param {Response} res - An express Response object with the info
   * this app will send back to the user e.g error messages like
   * ForbiddenOperationError.
   * @param {Function} next - The next function or middleware in the
   * callback stack of express.
   * @return {void}
   */
  static adminsOnly(req, res, next) {
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

  /**
   * Prevents users that are neither the owners of a resource nor admins
   * from accessing some endpoints or routes. If both of these conditions
   * are false, it returns a ForbiddenOperationError response. Otherwise,
   * it calls next().
   * @param {Request} req - An express Request object with data about the
   * original request sent to this endpoint e.g the profile of the user making
   * this request etc.
   * @param {Response} res - An express Response object with the info this app
   * will send back to the user e.g error messages like ForbiddenOperationError.
   * @param {Function} next - The next function or middleware in the callback
   * stack of express.
   * @return {void}
   */
  static accountOwnerOrAdminsOnly(req, res, next) {
    const path = req.path;
    const targetUserId = Number.parseInt(path.split('/')[1], 10);
    if (Number.isNaN(targetUserId)) {
      res.status(400)
        .json({
          message: 'The user id you supplied is not a number.',
          error: 'InvalidTargetUserIdError'
        });
      return;
    }

    const user = req.decodedUserProfile;
    const id = user.id;
    const roleId = user.roleId;
    if (roleId < 1 && id !== targetUserId) {
      res.status(403)
        .json({
          message: 'Sorry, you\'re not permitted perform this action.',
          error: 'ForbiddenOperationError'
        });
      return;
    }

    next();
  }
}
