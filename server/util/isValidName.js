/**
 * Tests a given string to see if it is a valid name by this app's standards.
 * This means that it must:
 * - be a string.
 * - have more than two (2) characters.
 * - not contain any whitespace character.
 * @param {String} name - The string to test as being a valid name.
 * @return {Boolean} - Returns true if the string is a valid name. Otherwise,
 * it returns false.
 */
export default function isValidName(name) {
  if (typeof name === 'string' && name.length > 1) {
    const whitespaceCharacters = /\s/;
    if (whitespaceCharacters.test(name)) {
      return false;
    }
    return true;
  }
  return false;
}