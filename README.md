# astroboy-router
> 配合astroboy框架使用，查看更多：[Astroboy](https://github.com/astroboy-lab/astroboy)

### CHANGE LOGS
#### 1.0.0-rc.15
* 增加PUT/POST/DELETE方法query参数的获取，在服务的第二个参数位置接收
* 优化了默认参数提取的工厂方法和config配置支持
#### 1.0.0-rc.14
* 修复astroboy没有默认路由实现的问题
* 内置提供了默认的参数获取函数和body处理函数
* 支持在astroboy的config里面配置参数修改router行为
#### 1.0.0-rc.12 
* 增加路由方法校验：检查business的方法实现，未实现的情况下服务启动过程会报错

## 1. 安装
```zsh
yarn add astroboy-router --save
# or
npm install astroboy-router --save
```

## 2. 构建Business层
> services/demo/BusinessService.ts
```typescript
import { BaseClass } from "astroboy";

class BusinessService extends BaseClass {

  queryParams(query: any){
    return { ...query };
  }

  queryParams2(query: any){
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

## 3. 定义router
> controllers/demo/DemoController.ts
```typescript
// 导入astroboy框架，如果必要
// 导入所需的业务逻辑
// 导入astroboy-router
import { Controller } from "astroboy";
import BusinessService from "your/service/file";
import { Router, Service, Index, API, Metadata, RouteMethod } from "astroboy-router";

// 1.设置router前缀【必要】
// 2.设置router的业务服务(需要从astroboy基础服务继承)
// 3.继承astroboy基础控制器【必要】
@Router("demo")
@Service(BusinessService)
class DemoController extends Controller {

  // 如果需要在自己实现的路由方法中引用，声明business
  // business会自动初始化，无需手动初始化
  // !! business名字限定，不要重命名
  private business!: BusinessService;

  // index页面，支持多路由
  // index页面逻辑请自己实现
  @Index(["index", "", "*"])
  public async getIndexHtml(){
    this.ctx.render("index.html");
  }

  // api定义
  // 支持按照astroboy的规则，默认路由方法实现
  // 限制：请确保business存在与路由方法同名的函数，此函数将被用于自动生成代码
  @API("GET", "query")
  public queryParams!: RouteMethod;

  @API("GET", "query2")
  @Metadata("路由名字")
  public queryParams02!: RouteMethod;

  // 或者你可以自己实现路由方法
  @API("POST", "change")
  public async changeData(){
    const postData = this.ctx.body;
    const result = await this.business.changeData(postData);
    this.ctx.json(0, "success", result);
  }

  // 支持获取body和query @1.0.0-rc.15
  @API("POST", "change2")
  public changeData2!: RouteMethod;

}
```

## 4. 生成router规则
> router/demo.ts
```typescript
import DEMO from "../controllers/demo/DemoController";
import { createRouter } from "astroboy-router";

export =  createRouter(DEMO, "demo.DemoController", "/section01/section02");
```

## 4. 最终生成路由
```
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
```