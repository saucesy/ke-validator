import proxyData from "../lib/utils/proxyData.js";

/**
 * @param {KeValidator} vm
 */
function initProxy(vm) {
  proxyData(vm, vm.$data, 2);
}

export default initProxy;

