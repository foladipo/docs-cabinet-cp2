/**
 * Truncate a (long) string after a specified number of characters.
 * @param {String} longText - The string to be truncated.
 * @param {Number} desiredLength - The number of characters of longText
 * that we want.
 * @return {String} - The truncated string, or the original string,
 * if its length is less than desiredLength.
 */
export default function truncateString(longText, desiredLength) {
  if (typeof longText !== 'string') return;
  if (desiredLength < 0) return;

  if (longText.length < desiredLength) {
    return longText;
  }

  const truncatedText = longText.substr(0, desiredLength);
  return `${truncatedText}...`;
}
