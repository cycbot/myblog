/**
 * Created by BadWaka on 2017/2/21.
 */

import constant from './constant';

function Util() {

}

/**
 * 根据类名查找类id
 *
 * @param typeName
 */
Util.prototype.getTypeIdByTypeName = function (typeName) {
  let types = localStorage.getItem(constant.types);
  try {
    types = JSON.parse(types);
    types.forEach(function (type) {
      if (type.typeName === typeName) {
        return type._id;
      }
    });
  } catch (e) {
    console.log(e);
    return false;
  }
};

/**
 * 根据类id查找类名
 *
 * 不知道为什么，这个函数的返回值是undefined
 *
 * @param typeId
 */
Util.prototype.getTypeNameByTypeId = function (typeId) {
  let types = localStorage.getItem(constant.types);
  // console.log(types);
  // console.log(typeId);
  try {
    types = JSON.parse(types);
    types.forEach(function (type) {
      if (type._id === typeId) {
        console.log(type.typeName);
        return type.typeName;
      }
    });
  } catch (e) {
    console.log(e);
    return false;
  }
};

export default new Util();
