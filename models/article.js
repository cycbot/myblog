/**
 * Created by BadWaka on 2017/2/11.
 */
let mongoose = require('mongoose');
let ArticleSchema = require('../schemas/article');

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
