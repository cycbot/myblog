<template>
  <section class="page">

    <!--外面的卡片样式-->
    <mu-paper class="loginView" :zDepth="2">

      <!--tab栏-->
      <mu-tabs :value="activeTab" @change="handleTabChange">
        <mu-tab value="tab1" title="登录"/>
        <!--<mu-tab value="tab2" title="注册"/>-->
      </mu-tabs>

      <!--中间的框-->
      <section class="main">

        <!--登录框-->
        <div class="login" v-if="activeTab === 'tab1'">
          <mu-text-field class="username" label="用户名" icon="person" labelFloat fullWidth v-model="loginOpts.username"/>
          <mu-text-field class="password" type="password" label="密码" icon="lock" labelFloat fullWidth
                         v-model="loginOpts.password"/>
          <mu-checkbox class="rememberPassword" label="记住密码" v-model="loginOpts.isRememberPassword"/>
          <mu-raised-button label="登录" class="btnLogin" primary @click="btnLogin"/>
        </div>

        <!--注册框-->
        <div v-if="activeTab === 'tab2'">

        </div>

      </section>
    </mu-paper>

    <!--提示框-->
    <mu-snackbar v-if="snackbar" :message="snackbarMsg" action="关闭" @actionClick="hideSnackbar" @close="hideSnackbar"/>

  </section>
</template>

<script>

  import constant from '../../common/js/constant';
  import router from '../../router';

  export default {
    data () {
      return {
        // snackbar
        snackbar: false,  // snackbar开关
        snackbarMsg: '',  // snackbar提示语
        // tab
        activeTab: 'tab1',
        // loginOpts
        loginOpts: {
          username: '',
          password: '',
          isRememberPassword: false
        }
      }
    },
    methods: {
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
      // 切换tab
      handleTabChange (val) {
        this.activeTab = val
      },
      // 点击登录
      btnLogin () {
        console.log('点击登录 btnLogin');
        console.log(this.loginOpts);
        this.login();
      },
      // 登录
      login () {
        const that = this;
        // 请求添加新类型接口
        this.$http.post('/blog/login', {
          username: this.loginOpts.username,
          password: this.loginOpts.password
        }).then(response => {
          console.log('请求成功 response = ');
          console.log(response);
          if (response.body.errorCode === 0) {
            if (that.loginOpts.isRememberPassword === true) {
              console.log('写入accessToken');
              localStorage[constant.accessToken] = response.body.data;
            }
            window.history.back();  // 后退到之前的页面
          } else {
            that.snackbarMsg = response.body.data;
            that.showSnackbar();
          }
        }, response => {
          console.log('请求失败 response = ');
          console.log(response);
        });
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .page {
    height: 100%;
    min-height: 750px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .loginView {
    width: 500px;

    .main {
      padding: 48px;

      .login {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .rememberPassword {
          margin-top: 12px;
        }

        .btnLogin {
          align-self: center;
          margin-top: 24px;
          width: 80%;
        }
      }

    }
  }


</style>
