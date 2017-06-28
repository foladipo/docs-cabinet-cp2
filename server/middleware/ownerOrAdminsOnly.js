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
 * @param {Function} next - The next function or middleware in the callback stack
 * of express.
 * @return {void}
 */
export default function adminsOnly(req, res, next) {
  const path = req.path;
  const targetUserId = Number(path.split('/')[1]);
  if (Number.isNaN(targetUserId)) {
    res.status(400)
      .json({ error: 'InvalidTargetUserIdError' });
    return;
  }

  const user = req.decodedUserProfile;
  const userId = user.userId;
  const roleId = user.roleId;
  if (roleId < 1 && userId !== targetUserId) {
    res.status(403)
      .json({
        error: 'ForbiddenOperationError'
      });
    return;
  }

  next();
}
