/**
 * @param value
 * @return {boolean}
 */
function isFunction(value) {
  return Object.prototype.toString.call(value) === "[object Function]";
}

module.exports = isFunction;
