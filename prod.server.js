'use strict';

// 生产环境服务器
// 引入模块
const express = require('express'); // 引入express
const config = require('./config/index'); // 引入配置文件
const mongoose = require('mongoose'); // 引入mongoose连接数据库
const bodyParser = require('body-parser');  // 引入body-parser解析请求过来的数据
const Article = require('./models/article');  // 引入Article Model
const Type = require('./models/type');  // 引入Type Model
const router = express.Router();
const blogRouter = express.Router(); // 定义Express的路由，并编写接口
const info = require('./info.json'); // 引入info.json

// 初始化
let port = process.env.PORT || config.build.port; // 取当前环境下的端口，如果没有的话就去取config文件里的端口
let app = express();

// 连接数据库
mongoose.connect('mongodb://localhost/blog');

// 使用中间件
app.use(router);
app.use(express.static('./dist'));  // 规定express的dist目录
app.use(bodyParser.json()); // 使用bodyParser将req.body解析成json，要不然是undefined
app.use('/blog', blogRouter);  // 使用该路由；所有的路由都要加上/blog，举个栗子：localhost:8080/blog/articles

// 监听端口
app.listen(port, function (err) {
  if (err) {
    handleError(err);
    return;
  }
  console.log('Listening at http://localhost:' + port);
});

// 错误处理函数
function handleError(err) {
  console.log(err);
}

/*-----------------------------路由----------------------------*/

// 定义接口
router.get('/', function (req, res, next) {
  req.url = '/index.html';
  next();
});

router.get('/blog', function (req, res, next) {
  req.url = '/index.html';
  next();
});

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
  console.log(req.body);

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


