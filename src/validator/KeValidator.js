import Rule from "./Rule.js";
import RuleField from "./RuleField.js";
import RuleResult from "./RuleResult.js";

import {
  get,
  isArray,
  isObject,
  deepClone,
  proxyData,
  isFunction,
  findMembers,
} from "../utils/index.js";

import {
  TypeException,
  OperateException,
  ParameterException,
} from "../exception";

class KeValidator {
  constructor() {
    this.$data = null;
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
    for (const el of this._getDataKeys()) {
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
   * @param request - 请求上下文对象
   * @return {KeValidator}
   */
  validate(request) {
    if (!isObject(request)) {
      throw new TypeException("The request must be an object type.");
    }
    if (request.isValidate) {
      throw new OperateException("Do not validate the same object twice.");
    }
    // 组装request请求对象上下文 并 保存到data中，深拷贝！避免引用造成的潜在性问题
    this._setData(deepClone(this._assembleParams(request)));
    // 查找成员属性和方法
    const memberKeys = findMembers(this, {
      // 根据指定的filter函数
      filter: this._findMembersFilter.bind(this),
    });
    
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
    this._punchMark(request);
    // 将数据附加到实例上下文中
    this._attachDataToContext();
    return this;
  }
  
  /**
   * @param data
   * @private
   */
  _setData(data) {
    this.$data = data;
  }
  
  /**
   * @param data
   * @private
   */
  _punchMark(data) {
    Object.defineProperty(data, "isValidate", {
      value: true,
    });
  }
  
  /**
   * @param request
   * @return {{path, query: any, header: *, body}}
   * @private
   */
  _assembleParams(request) {
    return {
      body: request.body,
      path: request.params,
      header: request.headers,
      // 修复[object null prototype]没有原型的问题
      query: JSON.parse(JSON.stringify(request.query)),
    };
  }
  
  /**
   * 将数据附加到上下文中，使用户可以通过 validatorInstance.body.xxx 或者 validatorInstance.xxx 获取数据
   * @private
   */
  _attachDataToContext() {
    proxyData(this, this.$data, 2);
  }
  
  /**
   * @param key
   * @return {boolean}
   * @private
   */
  _findMembersFilter(key) {
    // 验证方法是否为 validateXxx 这种格式
    if (/^validate([A-Z]\w+)+$/.test(key)) {
      return true;
    }
    // 如果是数组，数组元素必须是Rule类型
    if (isArray(this[key])) {
      // 遍历数组
      this[key].forEach((rule) => {
        const isRuleType = rule instanceof Rule;
        if (!isRuleType) {
          throw new Error("Verify that the elements of the array must be of type Rule.");
        }
      });
      // 如果没有抛出异常，则通过
      return true;
    }
    return false;
  }
  
  /**
   * @param key
   * @return {{pass}}
   * @private
   */
  _check(key) {
    // 声明结果对象
    let result;
    const isValidateFn = isFunction(this[key]);
    // 该成员变量是方法时
    if (isValidateFn) {
      // 使用try/catch捕获函数执行抛出的异常
      try {
        // 执行
        // @ts-ignore
        this[key](this.$data);
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
      // @ts-ignore
      const rules = this[key];
      // 实例化RuleField对象
      const ruleField = new RuleField(rules);
      // 通过key（验证器的属性）找到对应（客户端传来的）的值
      const params = this._findParams(key);
      // 校验值
      result = ruleField.validate(params.value);
    }
    if (!result.pass) {
      // 如果是验证函数，则不需要在错误信息前加 属性名
      result.message = `${isValidateFn ? "" : key} ${result.message}`;
    }
    return result;
  }
  
  /**
   * 通过指定的key从组装的data属性对象中获取值
   * @param key
   * @return {{path: *[], value}}
   * @private
   */
  _findParams(key) {
    let value;
    const path = [];
    for (const el of this._getDataKeys()) {
      value = get(this.$data, `${el}.${key}`);
      if (value) {
        path.push(el, key);
        break;
      }
    }
    return {
      path,
      value,
    };
  }
  
  /**
   * 获取data对象中所有属性的key
   * @return {Array}
   * @private
   */
  _getDataKeys() {
    const dataKeys = Object.keys(this.$data);
    this._getDataKeys = function () {
      return dataKeys;
    };
    return this._getDataKeys();
  }
}

export default KeValidator;
