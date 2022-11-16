/**
 * @param {KeValidator} vm
 * @param {Object} object
 */
import dfs from "../lib/utils/dfs.js";

function initParse(vm, object) {
  vm.$data = {};
  for (const field of vm.$fields) {
    let value = dfs(object, field);
    if (value && !value.__proto__) {
      value = JSON.parse(JSON.stringify(value));
    }
    vm.$data[field] = value || {};
  }
}

export default initParse;
