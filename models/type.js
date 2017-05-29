/**
 * Created by BadWaka on 2017/2/11.
 */
let mongoose = require('mongoose');
let TypeSchema = require('../schemas/type');

const Type = mongoose.model('Type', TypeSchema);

module.exports = Type;
