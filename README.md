# assets-route-plugin
> 配合astroboy框架使用，查看更多：[Astroboy](https://github.com/astroboy-lab/astroboy)

## 1. 安装
```zsh
yarn add assets-route-plugin --save
# or
npm install assets-route-plugin --save
```

## 2. 定义router
> controllers/demo/DemoController.ts
```typescript
// 导入astroboy框架，如果必要
// 导入所需的业务逻辑
// 导入assets-route-plugin
import { Controller } from "astroboy";
import BusinessService from "your/service/file";
import { Router, Service, Index, API, Metadata, RouteMethod } from "assets-route-plugin";

// 1.设置router前缀【必要】
// 2.设置router的业务服务(需要从astroboy基础服务继承)
// 3.继承astroboy基础控制器【必要】
@Router("demo")
@Service(BusinessService)
class DemoController extends Controller {

  // 如果需要在自己实现的路由方法中引用，声明business
  // business会自动初始化，无需手动初始化
  private business!: BusinessService;

  // index页面，支持多路由
  // index页面逻辑请自己实现
  @Index(["index", "another", "..."])
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
    const postData = this.ctx.getPostData();
    const result = await this.business.changeData(postData);
    this.ctx.json(0, "success", result);
  }

}
```

## 3. 生成router规则
> router/demo.ts
```typescript
import DEMO from "../controllers/demo/DemoController";
import { createRouter } from "assets-route-plugin";

export =  createRouter(DEMO, "demo.DemoController", "/section01/section02");
```

## 4. 最终生成路由
```
[ 
  'GET',
  [
    '/section01/section02/index',
    '/section01/section02/another',
    '/section01/section02/...'
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
]
```