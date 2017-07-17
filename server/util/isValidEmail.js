/**
 * Tests a given string to see if it is a valid email address.
 * @param {String} email - The string to test as being a valid email address.
 * @return {Boolean} - Returns true if the string is a valid email address.
 * Otherwise, it returns false.
 */
export default function isValidEmail(email) {
  const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/;
  return emailFormat.test(email);
}
