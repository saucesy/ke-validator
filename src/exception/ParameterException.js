class ParameterException extends Error {
  constructor(message) {
    super();
    this.message = message || "参数错误";
  }
}

module.exports = ParameterException;
