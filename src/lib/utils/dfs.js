import getKeys from "./getKeys.js";
/**
 * @param {object} object
 * @param {string} field
 * @return {*}
 */
function dfs(object, field) {
  let res;
  function search(data, key) {
    if (key === field) {
      return res = data;
    }
    const keys = getKeys(data);
    for (const key of keys) {
      search(data[key], key);
    }
  }
  search(object);
  return res;
}

export default dfs;
