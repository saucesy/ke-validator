



# ke-validator

`ke-validator`是一个快速、轻量级的`Express`和`Koa`验证器。

开发人员只需提供一系列规则或自定义函数，并提供需要验证的数据源，即可快速验证可信结果。

## Install

> 使用 [npm](https://github.com/npm/npm) 安装

```bash
npm install ke-validator
```

## Usage

### Koa

```bash
npm install koa koa-body ke-validator #注意Koa要求Node.js 7.6.0+支持async/await
```

index.js:

```javascript
const Koa = require("koa");
const { koabody } = require("koa-body");
const { Rule, KeValidator } = require("ke-validator");

const app = new Koa();

app.use(koaBody());

app.use((context, next) => {
    try {
        await next();
    } catch(error) {
        context.body = error.message;
    }
}); 

class RegisterValidator extendes KeValidator {
    constructor() {
        super();
        this.username = [
            new Rule({
                name: "isLength",
                message: "用户名长度需要在4~12之间",
                options: {min: 4, max: 12},
            })
        ];
        this.password = [
            new Rule({
                name: "isLength",
                message: "密码长度需要在8~32之间",
                options: {min: 8, max: 32},
            })
        ];
        this.repassword = function(row) {
            if(row.repassword !== row.password) {
                throw new Error("两次密码输入不一致，请重新输入");
            }
        }
    }
}

app.use((context) => {
    const v = new RegisterValidator().validate(context.request);
   	context.body = {
        code: 0,
        message: "OK",
        data: {
            username: v.username,
            password: v.body.password,
            repassword: v.get("username")
        }
    }
})

app.listen(3000);
```

### Express

```bash
npm install express ke-validator
```

index.js:

```javascript
const express = require("express");
const { Rule, KeValidator } = require("ke-validator");

const app = express();
app.use(express.json());

app.use((req, resp, next) => {
    try {
        await next();
    } catch(error) {
        resp.send(error.message);
    }
})

class RegisterValidator extendes KeValidator {
    constructor() {
        super();
        this.username = [
            new Rule({
                name: "isLength",
                message: "用户名长度需要在4~12之间",
                options: {min: 4, max: 12},
            })
        ];
        this.password = [
            new Rule({
                name: "isLength",
                message: "密码长度需要在8~32之间",
                options: {min: 8, max: 32},
            })
        ];
        this.repassword = function(row) {
            if(row.repassword !== row.password) {
                throw new Error("两次密码输入不一致，请重新输入");
            }
        }
    }
}

app.use((req, resp) => {
    const v = new RegisterValidator().validate(req);
   	const content = {
        code: 0,
        message: "OK",
        data: {
            username: v.username,
            password: v.body.password,
            repassword: v.get("username")
        }
    }
    resp.send(content);
})

app.listen(3000);
```

```bash
node index.js
curl -i http://localhost:3000 -d "username=test&password=1234567&repassword=12345678" 
>> $response
["用户名长度需要在4~12之间", "密码长度需要在8~32之间", "两次密码输入不一致，请重新输入"];

curl -i http://localhost:3000 -d "username=test123&password=12345678&repassword=12345678" 
>> $response 
{ 
	code: 0, 
	message: "OK", 
	data: {
        username: "test123", 
        password: "12345678", 
        repassword: "12345678"
	}
}
```

## Features

- 自动解析
- 多规则验证

- 多方式取值

  - 使用 `get` 方法取值，[查看实现](https://github.com/saucesy/ke-validator/blob/main/src/utils/get.js)

  - 使用 `.` 运算符取值和改值，[查看实现](https://github.com/saucesy/ke-validator/blob/main/src/utils/proxyData.js)

## Trilogy

### parse

> `ke-validator`的`validate`方法会自动从传入的参数中解析出需要的数据，假如传入的是参数名为`object`：

| 数据   | 描述                                                     |
| ------ | -------------------------------------------------------- |
| params | 路径参数，会自动从参数 object 中寻找名为 params 的属性   |
| query  | URL访问参数，会自动从参数 object 中寻找名为 query 的属性 |
| body   | 请求体，会自动从参数 object 中寻找名为 body 的属性       |
| header | 请求头，会自动从参数 object 中寻找名为 headers 的属性    |

### validate

> 在继承`KeValidator`基类时，你所添加的每个属性或方法应该满足以下条件：

- 你可以为属性赋值为函数，也可以直接写方法，这是允许的。

  - `ke-validator`会将当前验证的所有数据源返回给你，见示例：

  ```javascript
  	class RegisterValidator extendes KeValidator {
          constructor() {
              super();
              this.password = [
                  // ...
              ];
              
              // 方式一
              this.repassword = function(row) {
                  if(row.repassword !== row.password) {
                      throw new Error("Some problems have arisen");
                  }
              }
          }
          // 方式二
          verifyPassword({repassword, password}) {
              if(repassword !== password) {
              	throw new Error("Some problems have arisen");
              }
          }
      }
  ```

  - 注意
    - 当为函数时，如果期望能正确的处理错误，请始终抛出一个`Error`，否则`ke-validator`内部会认定为通过。
    - 请确保验证器中的属性名存在于传入的数据源中，否则将搜索不到该验证器属性名对应的值，则会抛出 "字段是必填参数"的错误。

- 你可以为成员属性赋值为数组，数组的每一项都必须是`Rule`类型，这意味着你必须显示的创建`Rule`对象。

```javascript
/**
 * name > 验证数据类型
 * options > 验证数据条件
 * message > 当未满足条件时，将为你抛出这个错误信息
 */
new Rule({
    name: "isLength",
    message: "长度需要在4~12之间",
    options: {min: 4, max: 12},
})

new Rule({
    name: "matches",
    message: "未通过指定格式",
    options: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
})
```



### get

> `ke-validator`为你提供了多种便捷的取值方式。注意：这仅在验证数据通过后！。

- 假设这是你提供的数据源

```javascript
context = {
    request: {
        query: {id: "xx"},
        params: {},
    	headers: {authorization: "xx"},
    	body: {username: "test123", password: "12345678", info: { age: 18, hobbies: [{ name: "code" }]}},
    }
}

class RegisterValidator extends KeValidator {
    constructor() {
        super();
        // ...
    }
}
```

- 普通取值，默认跳过` body`、`headers`、`query`、`params`直接获取下面的值

```javascript
v.get("id") >> "xx"
v.get("username") >> "test123"
```

- 支持获取嵌套对象以及数组对象的值

```javascript
v.get("info.age") >> 18
v.get("info.hobbies[0].name") ==> "code"
```

- 使用` .` 运算符取值

```javascript
v.username ==> "test123"
v.body.username ==> "test123"
```



## Extra

- `ke-validator`的验证基于 [validator.js](https://www.npmjs.com/package/validator)，如需进一步使用，请参考。

- `ke-validator`在成长中，避免不了些许错误。如果遇见了，欢迎您提交至[issue](https://github.com/saucesy/ke-validator/issues)，我们会尽快修正！

## Tests

测试正在使用`Jest`，要运行测试，请使用:

```bash
npm run test
```

## License (MIT)

```
MIT License

Copyright (c) 2022 saucesy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
