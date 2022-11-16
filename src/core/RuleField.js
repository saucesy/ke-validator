import RuleResult from "./RuleResult.js";

class RuleField {
  constructor(rules) {
    this.rules = rules;
  }
  
  validate({key, value}) {
    const result = new RuleResult(true);
    
    // 如果值不存在，则判断是否为可选的
    if (!value) {
      const isAllowEmpty = this._allowEmpty();
      if (!isAllowEmpty) {
        result.setPass(false);
        result.setMessage(key + " 字段是必填参数");
      }
      return result;
    }
    
    // 遍历每一个规则，当发现有一个规则不通过，则立即退出
    for (const rule of this.rules) {
      const ruleResult = rule.validate(value);
      if (!ruleResult.pass) {
        result.setPass(false);
        result.setMessage(ruleResult.message);
        return result;
      }
    }
    
    return result;
  }
  
  /**
   * @return {boolean}
   * @private
   */
  _allowEmpty() {
    let isOptional = false;
    for (const rule of this.rules) {
      if (rule.name === "isOptional") {
        isOptional = true;
        break;
      }
    }
    return isOptional;
  }
}

export default RuleField;

