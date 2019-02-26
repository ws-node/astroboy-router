# astroboy-router

> 配合 astroboy 框架使用，查看更多：[Astroboy](https://github.com/astroboy-lab/astroboy)

[![Build Status](https://travis-ci.org/ws-node/astroboy-router.svg?branch=plugin)](https://travis-ci.org/ws-node/astroboy-router)
[![Coverage Status](https://coveralls.io/repos/github/ws-node/astroboy-router/badge.svg?branch=master)](https://coveralls.io/github/ws-node/astroboy-router?branch=master)
[![package version](https://badge.fury.io/js/astroboy-router.svg)](https://badge.fury.io/js/astroboy-router.svg)

### CHANGE LOGS

#### 1.2.0-rc.3

- 修复 `CustomRoute` 不支持重置空 `section` 的问题
- 扩展了 `CustomRoute` 的 `tpl` 参数类型，支持定制额外的 `sections`

#### 1.1.0

- 完成 1.1.0 的版本功能锁定

#### 1.0.1

- 补充单侧，功能定版

#### 1.0.0-rc.26

- 去除对 astroboy 的定义依赖

#### 1.0.0-rc.25

- 修复自定义路由无法重写 api 部分的问题

#### 1.0.0-rc.24

- 新增@CustomRoute，代替@Index 和@API 提供高可定制的路由能力
- @Index 和@API 新增一个可选参数，提供部分可定制能力
- 拓宽@Router 的能力，支持定制 url 模板
- 拓宽 createRouter，提供一个新的重载，支持开启调试模式
- 兼容以前的版本

#### 1.0.0-rc.23

- 支持无前缀的 Router 控制器（提供空字符串即可）

#### 1.0.0-rc.22

- 新增装饰器@NoAuthorize，用于关闭单条 Route 的鉴权
- 拓宽了@Router 的参数，简化配置
- 支持使用@Router 修改 api 前缀

#### 1.0.0-rc.17

- 支持单路由重定义 business 服务
- 支持多服务依赖注入能力

#### 1.0.0-rc.16

- 增加 Router/Route 集成鉴权处理@Authorize

#### 1.0.0-rc.15

- 增加 PUT/POST/DELETE 方法 query 参数的获取，在服务的第二个参数位置接收
- 优化了默认参数提取的工厂方法和 config 配置支持

#### 1.0.0-rc.14

- 修复 astroboy 没有默认路由实现的问题
- 内置提供了默认的参数获取函数和 body 处理函数
- 支持在 astroboy 的 config 里面配置参数修改 router 行为

#### 1.0.0-rc.12

- 增加路由方法校验：检查 business 的方法实现，未实现的情况下服务启动过程会报错

## 1. 安装

```zsh
yarn add astroboy-router --save
# or
npm install astroboy-router --save
```

## 2. 构建 Business 层

> services/demo/BusinessService.ts

```typescript
import { BaseClass } from "astroboy";

class BusinessService extends BaseClass {
  queryParams(query: any) {
    return { ...query };
  }

  queryParams2(query: any) {
    return { ...query };
  }

  changeData(postData: any) {
    return { ...postData };
  }

  changeData2(postData: any, query: any) {
    return {
      postData,
      query
    };
  }

  testB(post: any, query: any) {
    return {
      post,
      query
    };
  }
}

export = BusinessService;
```

## 3. 定义 router

> controllers/demo/DemoController.ts

```typescript
// 导入astroboy框架，如果必要
// 导入所需的业务逻辑
// 导入astroboy-router
import { Controller } from "astroboy";
import BusinessService from "../services/demo/BusinessService";
import AnotherService from "...xxxx";
import ThirdService from "....xxxxxxxx";
import { Router, Service, Index, API, Metadata, RouteMethod, Inject } from "astroboy-router";

// 1.设置router前缀【必要】
// 2.继承astroboy基础控制器【必要】
// 3.支持使用Router装饰器做更多的事 1.0.0-rc.22
// @Router({
//   prefix: "demo",
//   auth: {
//     rules: xxxx,
//     metadata: xxxxx
//   }
// })
@Router("demo")
class DemoController extends Controller {
  // 服务级别DI @1.0.0-rc.17
  // 服务需要继承astroboy基础类，并会在第一次访问是动态初始化
  // 务必仅在typescript环境下使用， 确保emitDecoratorMetadata选项被打开
  // ！！注意字段不要使用business名称
  @Inject() private readonly service03!: ThirdService;

  // index页面，支持多路由
  // index页面逻辑请自己实现
  @Index(["index", "", "*"])
  public async getIndexHtml() {
    this.ctx.render("index.html");
  }

  // api定义
  // 支持按照astroboy的规则，默认路由方法实现
  // 限制：请确保business存在与路由方法同名的函数，此函数将被用于自动生成代码
  @API("GET", "query")
  @Service(BusinessService)
  public queryParams!: RouteMethod;

  @API("GET", "query2")
  @Metadata("路由名字")
  public queryParams02!: RouteMethod;

  // 或者你可以自己实现路由方法
  @API("POST", "change")
  public async changeData() {
    const postData = this.ctx.body;
    const result = await this.business.changeData(postData);
    this.ctx.json(0, "success", result);
  }

  // 支持获取body和query @1.0.0-rc.15
  @API("POST", "change2")
  public changeData2!: RouteMethod;

  @API("POST", "change2")
  @Service(AnotherService)
  public changeData3!: RouteMethod;
}
```

## 4. 生成 router 规则

> router/demo.ts

```typescript
import DEMO from "../controllers/demo/DemoController";
import { createRouter } from "astroboy-router";

export = createRouter(DEMO, "demo.DemoController", "/section01/section02");
```

## 5. 最终生成路由

````
[
  'GET',
  [
    '/section01/section02/demo/index',
    '/section01/section02/demo',
    '/section01/section02/demo/*'
  ],
  'demo.DemoController',
  'getIndexHtml'
],
[
  'GET',
  '/section01/section02/api/demo/query',
  'demo.DemoController',
  'queryParams'
],
[
  '路由名字',
  'GET',
  '/section01/section02/api/demo/query2',
  'demo.DemoController',
  'queryParams02'
]
[
  'POST',
  '/section01/section02/api/demo/change',
  'demo.DemoController',
  'changeData'
],
[
  'POST',
  '/section01/section02/api/demo/change2',
  'demo.DemoController',
  'changeData2'
]
```changeData2'
]
````

## 6. 路由集成鉴权

> npm:^1.0.0-rc.16

支持路由（Router/Route）级别集成权限处理

1. 编写鉴权服务（如有必要）
   > services/demo/auth.ts

```typescript
import { BaseClass } from "astroboy";

class AuthService extends BaseClass {
  sleep(time = 500) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  async checkIsLogin() {
    await this.sleep(10);
    return true;
  }

  async checkIsAdmin() {
    await this.sleep(10);
    if (this.ctx.header["auth"] === "admin") return true;
    return false;
  }

  async checkIsSuperAdmin() {
    await this.sleep(10);
    if (this.ctx.header["auth"] === "s_a") return true;
    return false;
  }
}

export = AuthService;
```

2. 编写鉴权工厂函数（如有必要）,构建鉴权组件

```typescript
import { AuthGuard } from "astroboy-router";

const authFac: (auth?: "admin" | "s_a") => AuthGuard = auth => {
  return async (ctx: AstroboyContext) => {
    if (auth === "admin") return await new AuthService(ctx).checkIsAdmin();
    else if (auth === "s_a") return await new AuthService(ctx).checkIsSuperAdmin();
    else return await new AuthService(ctx).checkIsLogin();
  };
};

const admin = [authFac("admin")];
const s_a = [authFac("s_a")];
const ad_sa = [...admin, ...s_a];
const meta = { error: new Error("鉴权失败") };
```

3. 在路由上使用

```typescript
@Router("demo")
@Service(DemoService)
@Authorize(ad_sa, meta)
// 支持Router级别挂载(可选)，默认会作用到所有子路由逻辑之前触发
// 可以在单条路有上关闭，实现独立逻辑
// 鉴权失败会抛出异常，请使用全局异常处理
class DemoController extends BaseClass {
  private business!: DemoService;

  @Index(["", "*"])
  public async getIndexHtml() {
    this.ctx.render("demo/index.html");
  }

  @API("GET", "testA")
  // 继承Router级别鉴权，并不新增额外的鉴权
  public testA!: RouteMethod;

  @API("POST", "testB")
  @Authorize(admin, scope_meta)
  // 不继承Router鉴权逻辑，独立定义当前Route的权限处理
  public testB!: RouteMethod;

  @API("GET", "testC")
  @NoAuthorize()
  // 单独Route清空鉴权逻辑
  // 如果没有定义Router级别鉴权，就不需要这样处理
  public testC!: RouteMethod;
}
```
