<template>
  <section class="page">
    <!--顶部工具栏-->
    <mu-appbar class="app-bar">{{article.title}}
      <!--返回按钮-->
      <mu-icon-button icon="arrow_back" slot="left" @click="back"/>
      <!--编辑-->
      <mu-icon-button icon="edit" slot="right" @click="edit"/>
      <mu-icon-button icon="delete" slot="right" @click="deleteArticle"/>
      <!--右侧菜单-->
      <!--<mu-icon-menu icon="more_vert" slot="right">-->
      <!--<mu-menu-item title="编辑" @click="edit"/>-->
      <!--<mu-menu-item title="删除" @click="deleteArticle"/>-->
      <!--</mu-icon-menu>-->
    </mu-appbar>

    <!--文章详情-->
    <mu-paper class="article" :zDepth="2">
      <!--使用v-html输出纯HTML-->
      <div class="markdown" v-html="article.articleContentHTML"></div>
    </mu-paper>

    <!--确认对话框-->
    <mu-dialog :open="dialogToggle" title="确认要删除该文章吗？" @close="closeDialog">
      <mu-flat-button slot="actions" @click="closeDialog" primary label="取消"/>
      <mu-flat-button slot="actions" primary @click="btnConfirm" label="确定"/>
    </mu-dialog>

    <!--提示框-->
    <mu-snackbar v-if="snackbar" :message="snackbarMsg" action="关闭" @actionClick="hideSnackbar" @close="hideSnackbar"/>

  </section>
</template>

<script>

  // 引入highlight.js来将代码块高亮
  import highlightjs from 'highlightjs';
  import router from '../../router';
  import constant from '../../common/js/constant';
  import marked from 'marked';  // 引入marked，用来将Markdown转换成HTML
  // 配置marked
  marked.setOptions({
    // 配置高亮
    highlight: function (code, lang, callback) {
      return highlightjs.highlightAuto(code).value;   // 这里highlightjs会自动给代码增加类
    }
  });

  export default {
    data () {
      return {
        // snackbar
        snackbar: false,  // snackbar开关
        snackbarMsg: '',  // snackbar提示语
        article: {},
        // 对话框开关
        dialogToggle: false
      }
    },
    // Vue实例创建之后被调用
    created () {
      console.log('created');
    },
    // activated
    activated () {
      console.log('activated');
      this.articleId = this.$route.params.id; // 从vue-router的路由拿到路由传过来的id
      this.getArticleDetailById();
    },
    methods: {
      // 后退
      back () {
        window.history.back();
      },
      // 显示错误提示
      showSnackbar () {
        this.snackbar = true;
        if (this.snackTimer) {
          clearTimeout(this.snackTimer);
        }
        this.snackTimer = setTimeout(() => {
          this.snackbar = false;
        }, 2000);
      },
      // 隐藏错误提示
      hideSnackbar () {
        this.snackbar = false;
        if (this.snackTimer) {
          clearTimeout(this.snackTimer);
        }
      },
      // 打开对话框
      openDialog () {
        this.dialogToggle = true;
      },
      // 关闭对话框
      closeDialog () {
        this.dialogToggle = false;
      },
      // 跳转到编辑页
      edit () {
        console.log('跳转到编辑页 edit');
        if (localStorage[constant.accessToken]) {
          router.push('/blog/admin/addArticle');
          localStorage[constant.articleDetail] = JSON.stringify(this.article);  // 把文章详情保存到localStorage中，用来在添加文章的页面展示已填写的数据
        } else {
          router.push('/blog/login');
        }
      },
      // 删除文章
      deleteArticle () {
        console.log('删除文章 deleteArticle');
        if (localStorage[constant.accessToken]) {
          this.openDialog();
        } else {
          router.push('/blog/login');
        }
      },
      // 点击确定
      btnConfirm () {
        const that = this;
        // 删除文章接口
        this.$http.post('/blog/admin/deleteArticle', {
          articleId: that.article._id
        }).then(response => {
          console.log('请求成功 response = ');
          console.log(response);
          if (response.body.errorCode === 0) {
            // 删除成功
            setTimeout(function () {
              window.history.back();
            }, 1000);
          }
          this.snackbarMsg = response.body.data;
          this.showSnackbar();
          this.closeDialog();
        }, response => {
          console.log('请求失败 response = ');
          console.log(response);
        });
      },
      // 根据id获取文章详情
      getArticleDetailById () {
        const that = this;
        // 请求文章详情，要带上文章id
        this.$http.get('/blog/articleDetail/' + this.articleId).then(response => {
          console.log(response);
          // 拿到数据
          this.article = response.body.data;
          let mdData = this.article.content;  // 拿到md格式内容数据
          // 因为简书里的#后接文字是可以被识别的，但是marked必须# 后接文字才可以被识别
          // 这里我想做一个需求，"###标题" 改为 "### 标题",但是我不知道怎么做
          mdData = mdData.replace(/#+/g, '# ');
          this.article.articleContentHTML = marked(mdData);    // html格式数据
        }, response => {  // 请求失败
          console.log(response);
        });
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

  .article {
    width: 90%;
    margin: 48px;
    padding: 48px;
  }

  .markdown {
    width: 100%;
  }

</style>
