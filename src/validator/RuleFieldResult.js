const RuleResult = require("./RuleResult");

class RuleFieldResult extends RuleResult {
  constructor(pass, message = "", value = null) {
    super(pass, message);
    this.value = value;
  }
}

module.exports = RuleFieldResult;
