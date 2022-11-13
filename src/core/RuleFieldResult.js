import RuleResult from "./RuleResult";

class RuleFieldResult extends RuleResult {
  constructor(pass, message = "", value = null) {
    super(pass, message);
    this.value = value;
  }
}

export default RuleFieldResult;
