'use strict';

require('./check-versions')();

let config = require('../config');
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

let opn = require('opn');
let path = require('path');
let express = require('express');
let fs = require('fs');   // 因为要读取.md文件，所以引入文件读取模块fs
let bodyParser = require('body-parser');  // 引入body-parser解析请求过来的数据
let mongoose = require('mongoose'); // 引入mongoose连接数据库
let Article = require('../models/article');  // 引入Article Model
let Type = require('../models/type');  // 引入Type Model
let info = require('../info.json'); // 引入info.json
const history = require('connect-history-api-fallback');  // HTML5 History 模式
const connect = require('connect'); // HTML5 History 模式

let webpack = require('webpack');
let proxyMiddleware = require('http-proxy-middleware'); // http 代理中间件
let webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf');

// default port where dev server listens for incoming traffic
let port = process.env.PORT || config.dev.port;
// automatically open browser, if not set will be false
let autoOpenBrowser = config.dev.autoOpenBrowser;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
let proxyTable = config.dev.proxyTable;

let app = express();
let compiler = webpack(webpackConfig);

app.use(history()); // HTML5 History 模式


/*********************************************************************/

// TODO 服务

// 连接数据库
mongoose.connect('mongodb://localhost/blog');

// 定义Express的路由，并编写接口
let blogRouter = express.Router();

// 使用中间件
app.use(bodyParser.json()); // 使用bodyParser将req.body解析成json，要不然是undefined
app.use('/blog', blogRouter); // 使用该路由；所有的路由都要加上/blog，举个栗子：localhost:8080/blog/articles

// 错误处理函数
function handleError(err) {
  console.log(err);
}

/*-----------------------------文章相关----------------------------*/

// 请求所有文章
blogRouter.get('/articles', function (req, res) {
  Article.fetch(function (err, articles) {
    if (err) {
      handleError(err);
      return;
    }
    // 处理数据
    articles = articles.map(function (article) {
      article.content = ''; // 删除content字段用来减少网络传输的字节，content详情页再获取
      return article;
    });
    res.json({
      errorCode: 0,
      data: articles
    });
  });
});

// 请求具体的某一篇文章
blogRouter.get('/articleDetail/:id', function (req, res) {
  let id = req.params.id;
  console.log('id = ' + id);

  Article.findById(id, function (err, article) {
    if (err) {
      handleError(err);
      return;
    }
    res.json({
      errorCode: 0,
      data: article
    });
  });
});

// 根据类型请求文章
blogRouter.get('/articleList/:typeId', function (req, res) {
  let typeId = req.params.typeId;
  console.log('typeId = ' + typeId);

  Article.findByTypeId(typeId, function (err, articles) {
    if (err) {
      handleError(err);
      return;
    }
    res.json({
      errorCode: 0,
      data: articles
    });
  });
});

// admin post article 后台添加文章接口
blogRouter.post('/admin/article/new', function (req, res) {
  console.log('后台添加文章接口 /admin/article/new body = ' + req.body);

  let article = req.body.article;
  let id = article._id;

  // 判断是否是添加新的数据还是更新旧的数据
  if (id === undefined) {
    // 新数据添加
    let articleTemp = new Article({ // 调用构造方法构造model
      title: article.title,
      intro: article.intro,
      link: article.link,
      typeId: article.typeId,
      typeName: article.typeName,
      img: article.img,
      content: article.content
    });
    articleTemp.save(function (err, article) {  // 保存至数据库
      if (err) {
        handleError(err);
        return;
      }
      res.json({
        errorCode: 0,
        data: '添加成功',
        articleId: article._id
      });
    });
  } else {
    console.log('更新数据');
    article.meta.updateAt = Date.now();
    // 旧数据更新
    Article.findOneAndUpdate({_id: id}, article, function (err, article) {
      if (err) {
        handleError(err);
        return;
      }
      res.json({
        errorCode: 1,
        data: '更新成功',
        articleId: article._id
      });
    });
  }
});

// 删除文章
blogRouter.post('/admin/deleteArticle', function (req, res) {
  let articleId = req.body.articleId;
  console.log('删除文章 articleId = ' + articleId);

  Article.remove({_id: articleId}, function (err, article) {
    if (err) {
      handleError(err);
      return;
    }
    res.json({
      errorCode: 0,
      data: '删除成功'
    });
  });
});

/*-----------------------------类型相关----------------------------*/

// 请求所有类型
blogRouter.get('/types', function (req, res) {
  Type.fetch(function (err, types) {
    if (err) {
      handleError(err);
      return;
    }
    res.json({
      errorCode: 0,
      data: types
    });
  });
});

// admin post type 后台添加类型接口
blogRouter.post('/admin/type/new', function (req, res) {
  console.log(req.body);

  let typePost = req.body.type;
  let typeName = typePost.typeName;
  let id = typePost._id;

  Type.findByTypeName(typeName, function (err, type) {
    if (err) {
      handleError(err);
      return;
    }
    console.log(type);
    // type === null 说明该类型数据库里没有，可以添加
    if (type === null) {
      // 新数据添加
      let typeTemp = new Type({ // 调用构造方法构造model
        typeName: typePost.typeName
      });
      typeTemp.save(function (err, type) {  // 保存至数据库
        if (err) {
          handleError(err);
          return;
        }
        res.json({
          errorCode: 0,
          data: '添加成功',
          typeId: type._id
        });
      });
    }
    // 数据库里有了该类型，不可以再添加
    else {
      res.json({
        errorCode: -1,
        data: '已有该类型'
      });
    }
  });
});

/*-----------------------------登录相关----------------------------*/

blogRouter.post('/login', function (req, res) {
  console.log(req.body);

  let username = req.body.username;
  let password = req.body.password;
  console.log('username = ' + username);
  console.log('password = ' + password);

  if (username !== info.administratorUsername) {
    console.log('用户名错误 username = ' + username);
    res.json({
      errorCode: 1,
      data: '用户名或密码错误'
    });
    return;
  }

  if (password !== info.administratorPassword) {
    console.log('密码错误 password = ' + password);
    res.json({
      errorCode: 1,
      data: '用户名或密码错误'
    });
    return;
  }

  let accessToken = 'demaxiyaisthebestplace';

  res.json({
    errorCode: 0,
    data: accessToken
  });
});

/*********************************************************************/


let devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
});

let hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {
  }
});
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({action: 'reload'});
    cb()
  })
});

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context];
  if (typeof options === 'string') {
    options = {target: options}
  }
  app.use(proxyMiddleware(options.filter || context, options))
});

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// serve pure static assets
let staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
app.use(staticPath, express.static('./static'));

let uri = 'http://localhost:' + port;

devMiddleware.waitUntilValid(function () {
  console.log('> Listening at ' + uri + '\n')
});


module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return
  }

  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
});
