/**
 * @param instance
 * @param filter
 * @return {[]|*}
 */
function findMembers(instance, {filter}) {
  // 递归函数
  function _find(instance) {
    //基线条件（跳出递归）
    if (instance.__proto__ === null) {
      return [];
    }
    let names = Object.getOwnPropertyNames(instance);
    names = names.filter((name) => {
      // 过滤掉不满足条件的属性或方法名
      if(filter) {
        if(filter(name)) {
          return true;
        }
      }
      return false;
    });
    
    return [...names, ..._find(instance.__proto__)];
  }
  
  return _find(instance);
}

export default findMembers;
