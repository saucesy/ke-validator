/**
 * @param arr
 * @return {boolean}
 */
function isArray(arr) {
  return Object.prototype.toString.call(arr) === "[object Array]";
}

module.exports = isArray;
