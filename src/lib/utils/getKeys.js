/**
 * @param object
 * @return {string[]|*[]}
 */
function getKeys(object) {
  if (typeof object !== "object" || object === null) {
    return [];
  }
  return Object.keys(object);
}

export default getKeys;
