import Rule from "./Rule.js";
import RuleField from "./RuleField.js";
import RuleResult from "./RuleResult.js";

import {
  get,
  dfs,
  isArray,
  isObject,
  deepClone,
  proxyData,
  isFunction,
} from "../lib/utils";

import {
  TypeException,
  OperateException,
  ParameterException,
} from "../lib/exception";

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
      throw new OperateException("The validate method is not allowed to be called before it is called.");
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
      throw new TypeException("The request must be an object type.");
    }
    if (object.isValidate) {
      throw new OperateException("Do not validate the same object twice.");
    }
    // 组装对象
    const params = this._assembleParams(object);
    // 保存参数
    this._setData(params);
    // 查找成员属性和方法
    const memberKeys = this._findMembers();
    // 声明错误集合，保存错误信息
    const errorMsg = [];
    // 遍历成员属性和方法组成的集合
    for (const key of memberKeys) {
      // 将成员依次放入check函数执行
      const result = this._check(key);
      // 如果未通过提供的验证，result.pass为false
      if (!result.pass) {
        errorMsg.push(result.message);
      }
    }
    // 如果 errorMsg 集合不为空。则抛出异常
    if (errorMsg.length) {
      throw new ParameterException(errorMsg);
    }
    // 为验证对象添加标记，防止重复验证
    this._punchMark(object);
    // 将数据附加到实例上下文中
    this._attachDataToContext();
    return this;
  }
  
  /**
   * @param data
   * @private
   */
  _setData(data) {
    this.$data = deepClone(data);
  }
  
  /**
   * @param data
   * @private
   */
  _punchMark(data) {
    Object.defineProperty(
      data,
      "isValidate",
      {
        value: true,
      },
    );
  }
  
  /**
   * @param {object} object
   * @return {object}
   * @private
   */
  _assembleParams(object) {
    const params = {};
    for (const field of this.$fields) {
      const value = dfs(object, field);
      if (value) {
        params[field] = value;
      }
      if (field === "query") {
        params[field] = JSON.parse(JSON.stringify(value));
      }
    }
    return params;
  }
  
  /**
   * @return {object}
   * @private
   */
  _assembleCompactParams() {
    return this.$fields.reduce((params, field) => Object.assign(params, this._findParams(field)), {});
  }
  
  /**
   * 将数据附加到上下文中，使用户可以通过 validatorInstance.body.xxx 或者 validatorInstance.xxx 获取数据
   * @private
   */
  _attachDataToContext() {
    proxyData(this, this.$data, 2);
  }
  
  /**
   * @return {*[]}
   * @private
   */
  _findMembers() {
    let proto = this;
    const members = [];
    while (proto !== KeValidator.prototype) {
      const names = Object.getOwnPropertyNames(proto);
      for (const name of names) {
        this._findMembersFilter(name) && members.push(name);
      }
      proto = proto.__proto__;
    }
    return members;
  }
  
  /**
   * @param key
   * @return {boolean}
   * @private
   */
  _findMembersFilter(key) {
    if (key === "constructor" || key === "$fields") {
      return false;
    }
    
    const value = this[key];
    if (isFunction(value)) {
      return true;
    }
    
    if (isArray(value) && key) {
      const isRuleType = value.every((v) => v instanceof Rule);
      if (!isRuleType) {
        throw new Error("Verify that the elements of the array must be of type Rule.");
      }
      return true;
    }
    return false;
  }
  
  /**
   * @param key
   * @return {RuleResult}
   * @private
   */
  _check(key) {
    // 声明结果对象
    let result;
    // 该成员变量是方法时
    if (isFunction(this[key])) {
      // 使用try/catch捕获函数执行抛出的异常
      try {
        const row = this._createRow();
        // 执行
        this[key](row);
        // 没有抛出异常，默认为true
        result = new RuleResult(true);
      } catch (error) {
        // 如果抛出了异常，需要在这里捕获
        result = new RuleResult(false, error.message || "Parameter Error.");
      }
    }
    // 该成员变量为属性时
    else {
      // 获取属性对应的值
      const rules = this[key];
      // 实例化RuleField对象
      const ruleField = new RuleField(rules);
      // 通过key（验证器的属性）找到对应（客户端传来的）的值
      const params = this._findParams(key);
      // 校验值
      result = ruleField.validate({key, value: params});
    }
    return result;
  }
  
  /**
   * 查询参数
   * @param key
   * @return {*}
   * @private
   */
  _findParams(key) {
    return dfs(this.$data, key);
  }
  
  /**
   * 创建
   * @return {*}
   * @private
   */
  _createRow() {
    return deepClone(this._assembleCompactParams());
  }
}

export default KeValidator;
