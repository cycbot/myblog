<template>
  <section class="page">
    <!--顶部工具栏-->
    <mu-appbar class="app-bar" :title="typeName">
      <!--返回按钮-->
      <mu-icon-button icon="arrow_back" slot="left" @click="back"/>
      <!--右侧菜单-->
      <mu-icon-menu icon="more_vert" slot="right">
      </mu-icon-menu>
    </mu-appbar>

    <!--文章列表-->
    <section class="articles">
      <!--引用子组件 ArticleItem 注意html代码中需要将驼峰转化成小写加短横线的形式-->
      <!--article 是父组件Index.vue传递给子组件ArticleItem.vue的props-->
      <article-item v-for="article in articles" :article="article"></article-item>
    </section>

    <!--底部分页栏-->
    <section class="pagination-wrapper">
      <mu-pagination :total="total" :current="current" @pageChange="paginationClick"
                     :pageSize="pageSize"></mu-pagination>
    </section>

  </section>
</template>

<script>

  import constant from '../../common/js/constant';  // 引入常量js
  import util from '../../common/js/util';  // 引入util
  import ArticleItem from '../../components/article-list/article-item/ArticleItem.vue'; // 引入文章项

  export default {
    // 包含的组件
    components: {
      ArticleItem
    },
    data () {
      return {
        typeId: '',
        typeName: '',
        types: [],
        current: 1, // 当前页数，Muse-UI默认是从1开始算的
        total: 1,  // 数据总数，默认写0的话 Muse-UI会出现一些问题
        pageSize: 10,  // 每页数据条数，默认每页10条
        articlesFull: {}, // 总的文章数据
        articles: {} // 要展现的文章数据
      }
    },
    // Vue实例创建之后被调用
    created () {
      this.getTypeNameByTypeId();
      this.getArticlesByTypeId();
    },
    // activated
    activated () {
      this.getTypeNameByTypeId();
      this.getArticlesByTypeId();
    },
    methods: {
      // 后退
      back () {
        window.history.back();
      },
      // 根据类型id获得类型名，并展示在文章列表标题栏
      getTypeNameByTypeId () {
        const that = this;
        this.typeId = this.$route.params.typeId; // 从vue-router的路由拿到路由传过来的id
        console.log('typeId = ' + this.typeId);
        try {
          this.types = JSON.parse(localStorage.getItem(constant.types));  // 从localStorage中取出数据
          this.types.forEach(function (type) {
            if (type._id === that.typeId) {
              that.typeName = type.typeName;
            }
          });
        } catch (e) {
          console.log(e);
        }
      },
      // 根据类型id获取文章数据
      getArticlesByTypeId () {
        // 请求文章列表数据
        this.$http.get('/blog/articleList/' + this.typeId).then(response => {  // 请求成功
          console.log('请求成功 response = ');
          console.log(response);
          this.articlesFull = response.body.data; // 获得所有数据
          this.total = this.articlesFull.length;  // 获得总数目，用来智能展示分页页数
          this.showArticles();
        }, response => {  // 请求失败，因为mock数据没有请求失败，所以暂时没有处理
          console.log('请求失败 response = ');
          console.log(response);
        });
      },
      // 分页栏点击
      paginationClick (index) {
        console.log('分页栏点击 index = ' + index);
        this.current = index;
        this.showArticles();
      },
      // 根据页数展示数据
      showArticles () {
        // 假设默认每页10条数据
        // current是1,则从下标0开始，到9结束
        // 传入的current是2,则从下标10开始，到19结束
        const start = (this.current - 1) * this.pageSize;
        const end = this.current * this.pageSize - 1;
        this.articles = this.articlesFull.slice(start, end);
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  // 引入颜色css
  @import "../../common/css/color.scss";

  .page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /*文章列表*/
  .articles {
    margin-top: 48px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /*底部分页栏*/
  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 48px;
  }

</style>
