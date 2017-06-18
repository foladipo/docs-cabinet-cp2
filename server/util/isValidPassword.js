/**
 * Tests a given string to see if it is a valid password by this app's standards.
 * This means that it must:
 * - be a string.
 * - have more than eight (8) characters.
 * - have at least one lower case letter.
 * - have at least one upper case letter.
 * - have at least one number.
 * - have at least one symbol.
 * @param {String} password - The string to test as being a valid password.
 * @return {Boolean} - Returns true if the string is a valid password. Otherwise,
 * it returns false.
 */
export default function isValidPassword(password) {
  if (typeof password === 'string') {
    if (password.length < 8) {
      return false;
    }
    const passwordFormat =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(){};':"|,./<>?`~])/;
    return passwordFormat.test(password);
  }
  return false;
}
