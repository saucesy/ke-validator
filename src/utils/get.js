/**
 * 根据指定的path作为对象object的key获取值。如果获取出来的value是undefined会以defaultValue取代
 * @param object
 * @param path
 * @param defaultValue
 * @return {*}
 */
function get(object, path, defaultValue) {
  if (typeof path !== "string") {
    throw new Error("The path argument must be a string");
  }
  // 保存object引用
  let value = object;
  // a[0][1] 这种情况，需要替换成a.0.1
  path = path.replace(/\[(.*?)]/g, ".$1").split(".");
  // 循环，从左到右取出值作为对象的key
  while (path.length) {
    value = value[path.shift()];
    if (!value) break;
  }
  // 如果value不存在（0、undefined、null……）则赋值为 defaultValue
  value = value === undefined ? value : defaultValue;
  // return
  return value;
}

export default get;
