/**
 * Returns an easy-to-understand access type for a document.
 * @param {String} access - The access type.
 * @param {Number} roleId - The role of a document's author.
 * @return {String} - An easy-to-read access type for a document.
 */
export default function getReadableAccessType(access, roleId) {
  if (typeof access !== 'string' || access.length < 1) return access;

  if (access === 'role') {
    const simpleRoleName = roleId === 0 ? 'regular users' : 'admins';
    return `Visible to other ${simpleRoleName}.`;
  }

  return `${access[0].toUpperCase()}${access.substr(1)} document.`;
}
