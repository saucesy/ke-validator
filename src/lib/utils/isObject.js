/**
 * @param value
 * @return {boolean}
 */
function isObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]" && value !== null;
}

export default isObject;
