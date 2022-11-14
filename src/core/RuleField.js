import RuleFieldResult from "./RuleFieldResult.js";

class RuleField {
  constructor(rules) {
    this.rules = rules;
  }
  
  validate({key, value}) {
    if (!value) {
      const isAllowEmpty = this._allowEmpty();
      
      if (isAllowEmpty) {
        return new RuleFieldResult(true, "");
      } else {
        return new RuleFieldResult(false, key + " 字段是必填参数");
      }
    }
    
    const fieldResult = new RuleFieldResult(false);
    
    for (const rule of this.rules) {
      const result = rule.validate(value);
      if (!result.pass) {
        fieldResult.value = null;
        fieldResult.message = result.message;
        return fieldResult;
      }
    }
    
    return new RuleFieldResult(true, "", this._convert(value));
  }
  
  /**
   * @return {boolean}
   * @private
   */
  _allowEmpty() {
    for (const rule of this.rules) {
      if (rule.name === "isOptional") {
        return true;
      }
    }
    return false;
  }
  
  /**
   * @param value
   * @return {boolean|number|*}
   * @private
   */
  _convert(value) {
    for (const rule of this.rules) {
      if (rule.name === "isInt") {
        return Number.parseInt(value);
      }
      if (rule.name === "isFloat") {
        return Number.parseFloat(value);
      }
      if (rule.name === "isBoolean") {
        return !!value;
      }
    }
    return value;
  }
}

export default RuleField;

