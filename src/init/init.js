import initParse from "./initParse.js";
import initProxy from "./initProxy.js";
import initValidate from "./initValidate.js";

/**
 *
 * @param {KeValidator} vm
 * @param {Object} originObject
 */

function init(vm, originObject) {
  // 解析
  initParse(vm, originObject);
  // 校验
  initValidate(vm);
  // 代理
  initProxy(vm);
  return vm;
}

export default init;
