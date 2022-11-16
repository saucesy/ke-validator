import isObject from "./isObject.js";

/**
 * 根据深度depth代理对象
 * @param vm
 * @param target
 * @param depth
 * @return {*}
 */
function proxyData(vm, target, depth = 1) {
  if (!isObject(target) || !depth) {
    return;
  }
  for (const key in target) {
    let value = target[key];
    proxyData(vm, value, --depth);
    Object.defineProperty(vm, key, {
        get() {
          return value;
        },
        set(newValue) {
          target[key] = newValue;
        },
        configurable: true
      }
    );
  }
}

export default proxyData;
