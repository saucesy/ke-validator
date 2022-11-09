class RuleResult {
  constructor(pass, message = "") {
    this.pass = pass;
    this.message = message;
  }
}

module.exports = RuleResult;
