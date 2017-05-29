var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var eslintFriendlyFormatter = require('eslint-friendly-formatter')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

// webpack 基本配置
module.exports = {
  // 入口配置
  entry: {
    app: './src/main.js'
  },
  // 输出配置
  output: {
    path: config.build.assetsRoot,  // 输出目录 根目录下会有一个dist目录存放输出的文件
    filename: '[name].js',  // 输出的文件名，name对应entry中的key，也就是说 最后输出的文件是app.js
    publicPath: process.env.NODE_ENV === 'production'  // 静态资源绝对路径
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  // 代码中通过require或者ES6中import引入的模块的配置
  resolve: {
    extensions: ['.js', '.vue', '.json'],   // 自动补全文件后缀
    modules: [
      resolve('src'),
      resolve('node_modules')
    ],
    alias: {  // 别名，引用资源时可缩短字符串长度
      'vue$': 'vue/dist/vue.common.js',
      'src': resolve('src'),
      'assets': resolve('src/assets'),
      'components': resolve('src/components')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: "pre",
        include: [resolve('src'), resolve('test')],   // include表示只检查以下目录的文件
        options: {
          formatter: eslintFriendlyFormatter
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,   // 当图片的文件大小小于10kb的时候，会生成一个base64串打包到js文件里；超过10kb的话，就会单独生成一个文件
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
