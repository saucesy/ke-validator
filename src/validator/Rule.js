import validator from "validator/es";
import RuleResult from "./RuleResult.js";

class Rule {
  
  constructor(name, message, params) {
    this.name = name;
    this.params = params;
    this.message = message;
  }
  
  validate(field) {
    if (this.name === "isOptional") {
      return new RuleResult(true);
    }
    if (!validator[this.name](field, this.params)) {
      return new RuleResult(false, this.message || "参数错误");
    }
    return new RuleResult(true, "");
  }
}

export default Rule;
