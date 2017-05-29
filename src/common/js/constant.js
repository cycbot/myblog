/**
 * 常量类
 *
 * Created by BadWaka on 2017/2/20.
 */
function Constant() {
  // 以下是存在localStorage中的参数
  this.types = 'types'; // 对文章的类型们types做一个缓存
  this.accessToken = 'accessToken'; // 保存accessToken
  this.articleDetail = 'articleDetail'; // 保存文章详情，用来编辑文章时使用
  this.isNeedRefresh = 'isNeedRefresh'; // 是否需要刷新
}

export default new Constant();
