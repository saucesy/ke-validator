import validator from "validator/es";
import RuleResult from "./RuleResult.js";

class Rule {
  /**
   *
   * @param name
   * @param message
   * @param options
   */
  constructor({name, message, options}) {
    this.name = name;
    this.message = message;
    this.options = options;
  }
  
  validate(field) {
    if (this.name === "isOptional") {
      return new RuleResult(true);
    }
    if (!validator[this.name](field, this.options)) {
      return new RuleResult(false, this.message || "参数错误");
    }
    return new RuleResult(true, "");
  }
}

export default Rule;
