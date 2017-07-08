import { Document, User } from '../models/';
import getLimitAndOffset from '../util/getLimitAndOffset';

/**
 * Defines the controller for the /search route.
 * @export
 * @class SearchController
 */
export default class SearchController {
  /**
   * Returns a list of users whose first or last name match a given query string.
   * The HTTP request's query parameters can also include a limit and offset for
   * the search. The limit is the number of users returned for each search and
   * the offset is the number of matching results to skip before collating
   * results (e.g if there are 50 users that match a query and an offset of 5
   * is given, then the list of returned users will start from the 6th user in
   * the database). The default limit is 30 and the default offset is 0. Note
   * that the request must include a query string for the search. Else, this
   * function sends a UserQueryNotSuppliedError response.
   * @param {Request} req - An express Request object with data about the
   * original request sent to this endpoint.
   * @param {Response} res - An express Response object that will contain
   * the info this app will send back to the user e.g error messages for
   * failed updates etc.
   * @return {void}
   */
  static searchUsers(req, res) {
    const limitAndOffset = getLimitAndOffset(req.query.limit, req.query.offset);
    const limit = limitAndOffset.limit;
    const offset = limitAndOffset.offset;
    const userQuery = req.query.q;
    if (userQuery === undefined || userQuery === '') {
      res.status(400)
        .json({
          message: 'Yikes! You didn\'t supply a search query.',
          error: 'UserQueryNotSuppliedError'
        });
      return;
    }

    User
      .findAll({
        where: {
          $or: [
            { firstName: { $iLike: `%${userQuery}%` } },
            { lastName: { $iLike: `%${userQuery}%` } },
            { username: { $iLike: `%${userQuery}%` } }
          ]
        },
        attributes: ['id', 'firstName', 'lastName', 'username', 'roleId'],
        limit,
        offset
      })
      .then((foundUsers) => {
        res.status(200).json({
          message: 'Users found.',
          users: foundUsers
        });
      });
  }

  /**
   * Returns a list of documents whose title match a given query string. The
   * HTTP request's query parameters can also include a limit and offset for
   * the search. The limit is the number of documents returned for each
   * search and the offset is the number of matching results to skip before
   * collating results (e.g if there are 50 documents that match a query and
   * an offset of 5 is given, then the list of returned documents will start
   * from the 6th document in the database). The default limit is 30 and the
   * default offset is 0. Note that the request must include a query string for
   * the search. Else, this function sends a DocumentQueryNotSuppliedError response.
   * @param {Request} req - An express Request object with data about the
   * original request sent to this endpoint.
   * @param {Response} res - An express Response object that will contain
   * the info this app will send back to the user e.g error messages for
   * failed updates etc.
   * @return {void}
   */
  static searchDocuments(req, res) {
    const userProfile = req.decodedUserProfile;
    const limitAndOffset = getLimitAndOffset(req.query.limit, req.query.offset);
    const limit = limitAndOffset.limit;
    const offset = limitAndOffset.offset;
    const documentTitleQuery = req.query.q;
    if (documentTitleQuery === undefined || documentTitleQuery === '') {
      res.status(400)
        .json({
          message: 'Yikes! You didn\'t supply a search query.',
          error: 'DocumentQueryNotSuppliedError'
        });
      return;
    }

    Document
      .findAll({
        include: [{ model: User, attributes: ['id', 'firstName', 'lastName', 'roleId'] }],
        where: {
          title: { $iLike: `%${documentTitleQuery}%` },
          $or: [
            { access: 'public' },
            { access: 'private', authorId: userProfile.id },
            {
              $and: [
                { access: 'role' },
                { '$User.roleId$': req.decodedUserProfile.roleId }
              ]
            }
          ]
        },
        attributes: ['id', 'title', 'content', 'access', 'categories', 'tags', 'createdAt', 'authorId'],
        order: [['createdAt', 'DESC']],
        limit,
        offset
      })
      .then((foundDocuments) => {
        res.status(200).json({
          message: 'Documents found.',
          documents: foundDocuments
        });
      });
  }
}
