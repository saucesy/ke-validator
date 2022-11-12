/**
 * 深拷贝
 * @param object
 * @return {*}
 */
function deepClone(object) {
  // 如果不是object类型或者等于null，则直接return
  if (typeof object !== "object" || object == null) {
    return object;
  }
  
  if (object instanceof Date) {
    return new Date(object);
  }
  
  if (object instanceof RegExp) {
    return new RegExp(object);
  }
  
  // 实例化对象原型上的构造器函数
  const target = new object.__proto__.constructor;
  
  // 遍历参数object
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      target[key] = deepClone(object[key]);
    }
  }
  return target;
}

export default deepClone;
