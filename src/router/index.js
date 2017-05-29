import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

// 导入需要路由的页面
import Index from 'components/index/Index'; // 主页
import ArticleList from '../components/article-list/ArticleList.vue'; // 文章列表页
import ArticleDetail from 'components/article-detail/ArticleDetail';  // 文章详情页
import Login from '../components/login/Login.vue';  // 登录页
import AddArticle from '../components/admin/add-article/AddArticle';  // 添加文章页
import Resume from '../components/resume/Resume.vue';  // 简历页

// 配置路由
export default new Router({
  saveScrollPosition: true, // 当用户点击后退按钮时，借助 HTML5 history 中的 popstate 事件对应的 state 来重置页面的滚动位置。注意，当 <router-view> 设定了相应的场景切换效果时，这个可能不会得到预想的效果。
  linkActiveClass: 'active',  // 激活class类名
  mode: 'history',  // 使用路由的history模式
  routes: [
    // 主页
    {
      path: '/blog',
      name: 'Index',
      component: Index
    },
    // 文章列表页
    {
      path: '/blog/articleList/:typeId',
      name: 'ArticleList',
      component: ArticleList
    },
    // 文章详情页
    {
      path: '/blog/articleDetail/:id',  // 这里设置了动态路径参数，因为需要根据不同的id访问不同的文章
      name: 'ArticleDetail',
      component: ArticleDetail
    },
    // 登录页
    {
      path: '/blog/login',
      name: 'Login',
      component: Login
    },
    // 添加文章页
    {
      path: '/blog/admin/addArticle',
      name: 'AddArticle',
      component: AddArticle
    },
    {
      path: '/blog/resume',
      name: 'Resume',
      component: Resume
    }
  ],
  scrollBehavior (to, from, savedPostion) {
    if (savedPostion) {
      return savedPostion;
    } else {
      return {x: 0, y: 0}
    }
  }
});

