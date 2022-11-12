/**
 * @param instance
 * @param filter
 * @return {[]|*}
 */
function findMembers(instance, {filter}) {
  function _find(instance) {
    if (instance.__proto__ === null) {
      return [];
    }
    let names = Object.getOwnPropertyNames(instance);
    names = names.filter((name) => {
      if (filter) {
        return !!filter(name);
      }
      return true;
    });
    
    return [...names, ..._find(instance.__proto__)];
  }
  
  return _find(instance);
}

export default findMembers;
