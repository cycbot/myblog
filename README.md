# myblog
使用vue全家桶搭建的个人博客

<a href="http://cycbot.cn/">cycbot.cn</a>

上一版的blog使用Python的web框架flask搭建，这一次希望能够好好操练一下现在最新的前端框架，因此把路由全放在前端，后端只提供数据接口。

> vue

vue在2016年大放异彩，作为2016年上升势头最猛的前端框架吸引了大量围观群众入坑，包括我。上个学期学习了vue的基础之后，便迫不及待的使用vue全家桶开发了这个博客练手。

基于vue2.0，vue-router实现前端路由，vue-resource进行网络请求。

> 目录结构

![index](http://on5kn0awz.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-03-30%20%E4%B8%8B%E5%8D%883.35.06.png)

由于对material design的喜爱，这次blog的页面样式基于[muse-ui](http://www.muse-ui.org/#/index)开发。

***

目前实现了功能:

* 博客文章的发布、管理
* 支持markdown
* 支持代码高亮
* 管理员权限

后续还考虑加入账户登录注册和评论功能

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

