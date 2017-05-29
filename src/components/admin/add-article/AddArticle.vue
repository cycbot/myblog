<template>
  <section class="page">
    <!--app bar-->
    <mu-appbar title="添加文章">
      <mu-icon-button icon='arrow_back' slot="left" @click="back"/>
    </mu-appbar>

    <!--文章详情-->
    <mu-paper class="article" :zDepth="2">
      <form>
        <!--文章标题-->
        <mu-text-field label="*标题" labelFloat fullWidth v-model="article.title"/>
        <!--选择文章类型-->
        <mu-select-field class="type-select" label="*类型" :maxHeight="300" labelFloat v-model="currentTypeIndex">
          <mu-menu-item title="添加新类型" value="0" @click="openAddTypeDialog"/>
          <!--这里添加一个index!==0的判断是因为选择器默认是有值的，设默认值为0，这时候第一个类型外面带过来的时候就不显示了，所以增加了一个空的类型放在0的位置，但是不显示它-->
          <mu-menu-item v-for="(type,index) in types" v-if="index!==0" :title="type.typeName" :value="index"/>
        </mu-select-field>
        <mu-text-field label="简介" labelFloat fullWidth v-model="article.intro"/>
        <mu-text-field label="链接" labelFloat fullWidth v-model="article.link"/>
        <mu-text-field label="图片地址" labelFloat fullWidth v-model="article.img"/>
        <mu-text-field label="*内容" labelFloat multiLine :rows="10" :rowsMax="30" fullWidth
                       v-model="article.content"/>
        <mu-raised-button class="btn" label="添加" primary @click="btnAddArticle"/>
      </form>
    </mu-paper>

    <!--提示框-->
    <mu-snackbar v-if="snackbar" :message="snackbarMsg" action="关闭" @actionClick="hideSnackbar" @close="hideSnackbar"/>
    <!--添加新类型对话框-->
    <mu-dialog :open="addTypeDialogToggle" title="添加新类型" @close="closeAddTypeDialog">
      <mu-text-field class="full-width" label="请输入类型名" labelFloat v-model="newType"/>
      <mu-flat-button slot="actions" @click="closeAddTypeDialog" primary label="取消"/>
      <mu-flat-button slot="actions" primary @click="btnAddType" label="确定"/>
    </mu-dialog>
    <!--添加新文章成功对话框-->
    <mu-dialog :open="addArticleSuccessDialogToggle" :title="addArticleSuccessDialogTitle"
               @close="closeAddArticleSuccessDialog">
      <mu-flat-button v-if="dialogType==='add'" slot="actions" primary @click="btnContinueAdd" label="继续添加"/>
      <mu-flat-button v-if="dialogType==='update'" slot="actions" primary @click="btnGoBack" label="返回"/>
      <mu-flat-button slot="actions" primary @click="btnViewArticle" label="查看文章"/>
    </mu-dialog>
  </section>
</template>

<script>

  import router from '../../../router';
  import constant from '../../../common/js/constant';

  export default {
    data () {
      return {
        currentTypeIndex: 0,
        newType: '',
        types: [],
        // snackbar
        snackbar: false,  // snackbar开关
        snackbarMsg: '',  // snackbar提示语
        // dialog
        dialogType: 'add',
        addTypeDialogToggle: false, // 添加新类型对话框，开关
        addArticleSuccessDialogToggle: false,  // 添加新文章成功对话框，开关
        addArticleSuccessDialogTitle: '',  // 添加新文章成功对话框，开关
        // 文章数据
        article: {
          title: '',
          intro: '',
          link: '',
          typeId_typeName: '',
          typeId: '',
          typeName: '',
          img: '',
          content: ''
        }
      }
    },
    created () {

    },
    // activated
    activated () {
      console.log('activated');
      this.getLocalArticleData();
      this.newType = this.article.typeName; // 把传过来的类名赋值给newType
      this.getTypes(true);  // 调用getTypes方法，并传入true，让类型自动更新成传过来的type
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
      // 添加类型对话框
      openAddTypeDialog () {
        this.addTypeDialogToggle = true;
      },
      closeAddTypeDialog () {
        this.addTypeDialogToggle = false;
      },
      // 添加文章成功对话框
      openAddArticleSuccessDialog () {
        this.addArticleSuccessDialogToggle = true;
      },
      closeAddArticleSuccessDialog () {
        this.addArticleSuccessDialogToggle = false;
      },
      // 得到本地的文章数据
      getLocalArticleData () {
        let articleDetail = localStorage[constant.articleDetail];
        if (articleDetail) {
          console.log('文章详情 = ' + articleDetail);
          articleDetail = JSON.parse(articleDetail);
          this.article = articleDetail;
          localStorage[constant.articleDetail] = '';  // 把传过来的值置空，保证不会混乱
        }
      },
      /**
       * 获得所有类型
       * @param isUpdateCurrentType 是否更新当前选中类型
       */
      getTypes (isUpdateCurrentType) {
        console.log('获得所有类型 getTypes');
        const that = this;
        this.$http.get('/blog/types').then(response => {
          console.log('请求成功 response = ');
          console.log(response);
          if (response.body.errorCode !== 0) {
            return;
          }
          that.types = response.body.data;  // 获得最新类型数据
          that.types.unshift(0);  // 这里在数组的第一个位置增加一个空值是因为选择器默认是有值的，设默认值为0，这时候第一个类型外面带过来的时候就不显示了，所以增加了一个空的类型放在0的位置，但是不显示它
          if (isUpdateCurrentType) {
            // 如果需要更新当前类型
            that.types.forEach(function (type, index) { // 遍历types数组
              console.log('type.typeName = ' + type.typeName + ' index = ' + index + ' newType = ' + that.newType);
              if (type.typeName === that.newType) { // 找到数组中最新添加的那项
                that.currentTypeIndex = index;  // 把数组中该元素的下标赋给当前选中项
                that.newType = '';  // 把新类型置为空
              }
            });
          }
        }, response => {
          console.log('请求失败 response = ');
          console.log(response);
        });
      },
      // 添加新类型按钮
      btnAddType () {
        console.log('添加新类型按钮 btnAddType');
        this.addTypeFormValidate();
      },
      // 类型表单校验
      addTypeFormValidate () {
        console.log('类型表单校验 addTypeFormValidate');
        if (!this.newType) {
          this.snackbarMsg = '类型名不能为空，请重新填写';
          this.showSnackbar();
          return;
        }
        this.addType();
      },
      // 添加新类型
      addType () {
        console.log('添加新类型 addType');
        // 请求添加新类型接口
        this.$http.post('/blog/admin/type/new', {
          type: {
            typeName: this.newType
          }
        }).then(response => {
          console.log('请求成功 response = ');
          console.log(response);
          if (response.body.errorCode === 0) {
            // 添加成功
            this.getTypes(true);
          }
          this.snackbarMsg = response.body.data;
          this.showSnackbar();
          this.closeAddTypeDialog();
        }, response => {
          console.log('请求失败 response = ');
          console.log(response);
        });
      },
      // 点击添加文章按钮
      btnAddArticle () {
        console.log('当前选中的文章类型的下标 currentTypeIndex = ' + this.currentTypeIndex);
        this.addArticleFormValidate();
      },
      // 文章表单校验
      addArticleFormValidate () {
        console.log('文章表单校验 addArticleFormValidate');
        this.article.typeId = this.types[this.currentTypeIndex]._id;
        this.article.typeName = this.types[this.currentTypeIndex].typeName;
        if (!this.article.title || !this.article.typeId || !this.article.typeName || !this.article.content) {
          // 如果必填字段为空，弹出提示语
          this.snackbarMsg = '请填写带*字段';
          this.showSnackbar();
          return;
        }
        this.addArticle();
      },
      // 添加文章
      addArticle () {
        console.log('添加文章 addArticle');
        // 请求添加新文章接口
        this.$http.post('/blog/admin/article/new', {
          article: this.article
        }).then(response => {
          console.log('请求成功 response = ');
          console.log(response);
          if (response.body.errorCode === 0) {
            // 添加成功
            this.dialogType = 'add';
          } else if (response.body.errorCode === 1) {
            // 更新成功
            this.dialogType = 'update';
          }
          this.addArticleSuccessDialogTitle = response.body.data;
          this.newArticleId = response.body.articleId;  // 拿到新文章的id
          this.openAddArticleSuccessDialog();
        }, response => {
          console.log('请求失败 response = ');
          console.log(response);
        });
      },
      // 继续添加
      btnContinueAdd () {
        console.log('继续添加 btnContinueAdd');
        // 清空文章数据
        this.article = {
          title: '',
          intro: '',
          link: '',
          typeId_typeName: '',
          typeId: '',
          typeName: '',
          img: '',
          content: ''
        };
        // 重置选中的类型
        this.currentTypeIndex = '';
        // 关闭对话框
        this.closeAddArticleSuccessDialog();
      },
      // 返回
      btnGoBack () {
        sessionStorage[constant.isNeedRefresh] = true;
        history.go(-2);
        this.closeAddArticleSuccessDialog();
      },
      // 查看文章
      btnViewArticle () {
        console.log('查看文章 btnViewArticle');
        const articleId = this.newArticleId;  // 拿到文章id
        router.push('/blog/articleDetail/' + articleId);  // 跳转到文章详情页
        this.closeAddArticleSuccessDialog();
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  // 引入颜色css
  @import "../../../common/css/color.scss";

  .full-width {
    width: 100%;
  }

  .page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  form {
    padding: 48px;
    display: flex;
    flex-direction: column;
  }

  .article {
    margin: 48px;
    width: 90%;

    .type-select {
      width: 100%;
    }

    .btn {
      margin-bottom: 24px;
    }
  }
</style>
