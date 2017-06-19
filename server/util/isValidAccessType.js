/**
 * Checks whether a given access type is valid. That is, the said access type
 * is recognized by this app.
 * @param {String} someAccess - a string containing a possibly valid access
 * type for a document.
 * @return {Boolean} - returns true if this is an access type recognized
 * by this app and false if otherwise.
 */
function isValidAccessType(someAccess) {
  if (typeof someAccess !== 'string' || someAccess === '') {
    return false;
  }
  const access = someAccess.toLowerCase();
  const PERMITTED_ACCESS_TYPES = ['public', 'private', 'role'];
  if (PERMITTED_ACCESS_TYPES.indexOf(access) === -1) {
    return false;
  }

  return true;
}

export default isValidAccessType;
