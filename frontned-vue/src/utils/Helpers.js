/**
 * Check if a string ends in slash, if not add it
 * @param {String} str
 * @returns
 */
export function trailingSlash (str) {
  return str.endsWith('/') ? str : str + '/'
}
  