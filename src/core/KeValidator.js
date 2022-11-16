import init from "../init/init.js";
import get from "../lib/utils/get.js";
import isObject from "../lib/utils/isObject.js";

class KeValidator {
  constructor() {
    this.$data = null;
    this.$fields = ["params", "query", "headers", "body"];
  }
  
  /**
   * 根据指定的key从请求对象中解析值，如果解析出来的value是undefined会被defaultValue取代。
   * @param {string} key - 指定的键名
   * @param {*} defaultValue - 默认值
   * @return {*} value
   * @example
   *  1、参数 key 可以为单个字符，也可以是字符串
   *  当为字符串时，需要用英文句号 "." 分隔符来表示多个属性.
   *  2、参数defaultValue作为在解析value值为undefined时的默认值，这是可选的.
   *
   *  假设request对象存在这样一些属性：
   *    {
   *      params: { id: 10 },
   *      body: { username: "xxx" },
   *      header： { authorization: "1010101" },
   *      ……
   *    }
   *
   *  你可以这样去获取值：
   *    - v.get("id") ==> 10
   *    - v.get("username") ==> xxx
   *    - v.get("authorization") ===> 1010101
   * @see https://github.com/saucesy/ke-validator#readme
   */
  get(key, defaultValue = undefined) {
    if (!this.$data) {
      throw new Error("The validate method is not allowed to be called before it is called.");
    }
    let value = null;
    for (const el of this.$fields) {
      value = get(this.$data, `${el}.${key}`, defaultValue);
      if (value) break;
    }
    return value;
  }
  
  /**
   * 根据request请求上下文对象做数据源，使用一系列规则来校验数据是否合法.
   * @example
   * 假如我们在做注册操作，需要对用户输入的用户名、密码、邮箱等做长度、强度、格式做校验
   * 你可以按照这样的操作来进行，当未通过规则时，你应该提前捕获异常，以免漏掉错误信息.
   *
   * 1、创建一个RegisterValidator类，继承KeValidator
   *  ……
   *    class RegisterValidator extends KEValidator {
   *      constructor() {
   *        super();
   *        this.username = [
   *          new Rule("isLength", "用户名长度需在4~12个字符之间", {min: 4, max: 12})
   *        ]
   *      }
   *    }
   *  ……
   *
   * 2、当请求到来时，你应该提前创建好RegisterValidator对象，并调用validate方法，传入request请求上下文对象
   *  ……
   *    new RegisterValidator().validate(request);
   *  ……
   * 3、验证器会为那些未通过的规则的值抛出异常，你应该去主动捕获并处理该异常，当然更好的策略是用一个全局异常捕获，这将省去一部分工作量
   *  ……
   *    try {
   *      new RegisterValidator().validate(request);
   *    } catch(error) {
   *      // do something...
   *    }
   *  ……
   * @see https://github.com/saucesy/ke-validator#readme
   * @param {object} object - 数据源
   * @return {KeValidator}
   */
  validate(object) {
    if (!isObject(object)) {
      throw new Error("The data to be validated must be of an object type.");
    }
    return init(this, object);
  }
}

export default KeValidator;
