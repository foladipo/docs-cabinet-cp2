/**
 * Truncate a (long) string after 50 characters.
 * @param {String} text - The string to be truncated.
 * @return {String} - The truncated string, or the original string,
 * if its length is less than 50.
 */
export default function getFirstWords(text) {
  if (typeof text !== 'string') return;

  if (text.length < 50) {
    return text;
  }

  const firstWords = text.substr(0, 51);
  return `${firstWords}...`;
}
