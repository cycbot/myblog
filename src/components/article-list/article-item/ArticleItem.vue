<template>
  <section class="wrapper" @click="articleDetail">
    <!--使用Muse-UI的纸张控件-->
    <mu-paper class="wrapper2" :zDepth="2">
      <!--标题-->
      <div class="title">{{article.title}}</div>
      <!--简介-->
      <div v-if="article.intro" class="intro">简介：{{article.intro}}</div>
      <!--额外信息-->
      <div class="extra">
        <!--类型名-->
        <mu-raised-button :label="article.typeName" class="lower-case" @click="btnType"/>
        <!--更新时间-->
        <span class="updateAt">{{article.updateAt}}</span>
      </div>
    </mu-paper>
  </section>
</template>

<script>
  import router from '../../../router';

  export default {
    // 定义从父控件继承的props
    props: {
      // 规定属性article的类型
      article: {
        type: Object
      }
    },
    data () {
      return {}
    },
    created () {
      console.log('item created');
      this.timeFormat();
    },
    // activated
    activated () {
      console.log('item activated');

    },
    methods: {
      // 跳转到文章详情页
      articleDetail () {
        console.log('跳转到文章详情页 articleDetail');
        router.push('/blog/articleDetail/' + this.article._id);
      },
      // 点击类型按钮
      btnType (e) {
        console.log('点击类型按钮 btnType');
        e.stopPropagation();  // 阻止事件冒泡
        e.cancelBubble = true;  // IE，阻止事件冒泡
        let typeId = this.article.typeId;
        console.log(this.article.typeName + ' ' + this.article.typeId);
        router.push('/blog/articleList/' + typeId); // 跳转到文章列表
      },
      // 时间格式化
      timeFormat () {
        let updateAt = this.article.meta.updateAt;
        updateAt = new Date(updateAt);
        updateAt = updateAt.toLocaleString();
        this.article.updateAt = updateAt;
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  // 设置默认大小写
  .lower-case {
    text-transform: none;
  }

  /*最外层wrapper*/
  .wrapper {
    width: 90%;
    margin-bottom: 24px;
    color: #000;
    cursor: pointer; // 鼠标移向后指针变为点击

    .wrapper2 {
      padding: 24px;
      border-radius: 4px;

      .title {
        font-size: 24px;
        margin-bottom: 24px;
      }

      .intro {
        font-size: 16px;
        margin-bottom: 16px;
      }

      .extra {
        display: flex;
        align-items: center;

        .updateAt {
          margin-left: 24px;
        }
      }
    }

    .wrapper2:hover {
      transform: scale(1.05, 1.05);
    }

  }

</style>
