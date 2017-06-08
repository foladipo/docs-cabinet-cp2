/**
 * Returns the limit and offset to be used for querying various tables in
 * this app's database. Other details include:
 * - the default limit is 30, and is used when someLimit is not specied
 * and DEFAULT_LIMIT_OF_RESULTS is not configured in this app's `.env` file
 * - the default offset is 0, and is used when someOffset is not specied
 * and DEFAULT_OFFSET_OF_RESULTS is not configured in this app's `.env` file
 * @param {String|null} someLimit - the number of results to return per each request.
 * @param {String|null} someOffset - the number of results in the database to skip
 * before starting to fetch results. So, for example, if there are 50 results and
 * the offset is 5, then the list of returned results will start from the 6th result in
 * the database.
 * @return {Object<Integer>} - an object with the limit and offset to use for the
 * desired query.
 */
export default function getLimitAndOffset(someLimit, someOffset) {
  const defaultNumberOfResults = process.env.DEFAULT_LIMIT_OF_RESULTS || '30';
  const defaultOffset = process.env.DEFAULT_OFFSET_OF_RESULTS || '0';

  let limit;
  let offset;
  if (someLimit) {
    limit = Number.parseInt(someLimit, 10);
  } else {
    limit = Number.parseInt(defaultNumberOfResults, 10);
  }
  if (someOffset) {
    offset = Number.parseInt(someOffset, 10);
  } else {
    offset = Number.parseInt(defaultOffset, 10);
  }

  limit = Number.isNaN(limit) ? 30 : limit;
  offset = Number.isNaN(offset) ? 0 : offset;

  return { limit, offset };
}
