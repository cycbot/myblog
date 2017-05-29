/**
 * Created by BadWaka on 2017/2/11.
 */
const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: String,  // 文章名
  intro: String,  // 文章简介
  link: String,   // 文章链接
  typeId: String, // 类型id
  typeName: String, // 类型名
  img: String,  // 文章图片
  content: String,  // 文章内容
  meta: {
    createAt: { // 创建时间
      type: Date,
      default: Date.now()
    },
    updateAt: { // 更新时间
      type: Date,
      default: Date.now()
    }
  }
});

// pre()的意思是，每次进行save操作之前，都会调用这个方法
ArticleSchema.pre('save', function (next) {
  // 判断数据是否是新添加的
  if (this.isNew) {
    // 如果是，则将创建时间和更新时间都设置为当前时间
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    // 否则，只更新更新时间
    this.meta.updateAt = Date.now();
  }
  // 走接下来的流程
  next();
});

ArticleSchema.statics = {

  // fetch方法，用来取出数据库里面所有的数据
  fetch: function (cb) {
    return this
      .find()
      .sort('-meta.updateAt')  // 排序;根据更新时间排序；前面加-号表示降序
      .exec(cb);
  },

  // 根据id，查询单条数据
  findById: function (id, cb) {
    return this
      .findOne({
        _id: id
      })
      .exec(cb);
  },

  // 根据类型id，查询
  findByTypeId: function (typeId, cb) {
    return this
      .find({
        typeId: typeId
      })
      .sort('-meta.updateAt')  // 排序;根据更新时间排序；前面加-号表示降序
      .exec(cb);
  }
};

// 导出模式
module.exports = ArticleSchema;
