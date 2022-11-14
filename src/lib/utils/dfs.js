import isObject from "./isObject.js";

/**
 * @param {object} object
 * @param {string} field
 * @return {*}
 */
function dfs(object, field) {
  let value = null;
  const _search = (data) => {
    if (!isObject(data)) return;
    value = data[field];
    for (const key in data) {
      if (value) break;
      _search(data[key]);
    }
  };
  _search(object);
  return value;
}

export default dfs;
