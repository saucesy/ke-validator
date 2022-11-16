import Rule from "../core/Rule.js";
import RuleField from "../core/RuleField.js";
import RuleResult from "../core/RuleResult.js";
import KeValidator from "../core/KeValidator.js";

import dfs from "../lib/utils/dfs.js";
import isArray from "../lib/utils/isArray.js";
import deepClone from "../lib/utils/deepClone.js";
import isFunction from "../lib/utils/isFunction.js";

const blackList = ["constructor", "$fields"];

/**
 * @param {Object} vm
 */
function initValidate(vm) {
  const members = _find(vm);
  const errorMsg = _check(vm, members);
  if (errorMsg.length) {
    throw new Error(errorMsg.join("、"));
  }
}

/**
 * @param {object} vm
 * @return {String[]}
 * @private
 */
function _find(vm) {
  const members = [];
  while (vm !== KeValidator.prototype) {
    const names = Object.getOwnPropertyNames(vm);
    for (const name of names) {
      _findFilter(vm, name) && members.push(name);
    }
    vm = vm.__proto__;
  }
  return members;
}

/**
 * @param {object} vm
 * @param {String[]} members
 * @return {String[]}
 * @private
 */
function _check(vm, members) {
  const errorMsg = [];
  for (const member of members) {
    const result = _checkMember(vm, member);
    !result.pass && errorMsg.push(result.message);
  }
  return errorMsg;
}

/**
 * @param {object} vm
 * @param {String} name
 * @return {boolean}
 * @private
 */
function _findFilter(vm, name) {
  if (blackList.includes(name)) {
    return false;
  }
  
  const value = vm[name];
  if (isFunction(value)) {
    return true;
  }
  
  if (isArray(value)) {
    const isRuleType = value.every((v) => v instanceof Rule);
    if (!isRuleType) {
      throw new Error("Verify that the elements of the array must be of type Rule.");
    }
    return true;
  }
  return false;
}

/**
 * @param {object} vm
 * @param {String} member
 * @private
 */
function _checkMember(vm, member) {
  const $data = vm.$data;
  const rules = vm[member];
  let result = new RuleResult();
  if (isFunction(rules)) {
    try {
      rules(_createCompactParams($data));
      result.setPass(true);
    } catch (error) {
      result.setPass(false);
      result.setMessage(error.message);
    }
  } else {
    const ruleField = new RuleField(rules);
    result = ruleField.validate({key: member, value: dfs($data, member)});
  }
  return result;
}

/**
 * @param {Object} data
 * @return {Object}
 * @private
 */
function _createCompactParams(data) {
  const compactParams = Object.keys(data).reduce(
    (params, key) => {
      return Object.assign(params, dfs(data, key));
    }, {});
  return deepClone(compactParams);
}

export default initValidate;
