class OperateException extends Error {
  constructor(message) {
    super();
    this.message = message || "操作异常";
  }
}

export default OperateException;
