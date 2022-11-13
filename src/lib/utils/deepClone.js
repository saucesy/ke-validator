/**
 * 深拷贝
 * @param object
 * @return {*}
 */
function deepClone(object) {
  if (typeof object !== "object" || object == null) {
    return object;
  }
  
  if (object instanceof Date) {
    return new Date(object);
  }
  
  if (object instanceof RegExp) {
    return new RegExp(object);
  }
  
  const target = new object.__proto__.constructor;
  
  for (const key in object) {
    if (Object.hasOwnProperty.call(object, key)) {
      target[key] = deepClone(object[key]);
    }
  }
  return target;
}

export default deepClone;
