<template>
  <div>
    <!--rules登录校验-->
    <el-form :rules="rules"
             ref="loginForm"
             :model="loginForm"
             class="loginContainer"
             v-loading="loading"
             element-loading-text="正在登录"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)">
      <h3 class="loginTitle">系统登录</h3>
      <!--prop属性用于表单验证-->
      <el-form-item prop="username">
        <el-input type="text" auto-complete="false" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" auto-complete="false" v-model="loginForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input type="text"
                  auto-complete="false"
                  v-model="loginForm.code"
                  placeholder="点击图片更换验证码"
                  style="width: 250px; margin-right: 5px"></el-input>
        <el-image :src="captchaUrl" @click="updateCaptcha"/>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
        <el-button type="primary" style="width: 100%" @click="submitLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: "Login",
  data() {
    return {
      //确保验证码可以正常刷新，而不是使用第一次的缓存数据
      captchaUrl: '/captcha?time=' + new Date(),
      checked: true,
      loading: false,
      loginForm: {
        username: 'admin',
        password: '123456',
        code: ''
      },
      /*element-ui约定的验证规则*/
      rules: {
        //required：是否必填  message: 未通过校验的提示信息  trigger：什么时候触发
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
      }
    }
  },
  methods: {
    submitLogin() {
      //登录验证
      //表单对象内置的方法，会触发所有校验；valid表示是否通过所有校验
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.postRequest('/login', this.loginForm).then(resp => {
            this.loading = false
            if (resp) {
              //存储用户token
              const tokenStr = resp.obj.tokenHead + resp.obj.token
              window.sessionStorage.setItem('tokenStr', tokenStr)
              //跳转到首页或者地址栏上想去的地方
              let path = this.$route.query.redirect;
              this.$router.replace((path === '/' || path == undefined) ? '/home' : path)

            }
          })
        } else {
          this.$message({
            showClose: true,
            message: '请输入所有字段',
            type: 'error'
          });
          return false;
        }
      })
    },
    updateCaptcha() {
      this.captchaUrl = '/captcha?time=' + new Date()
    },
  },
}
</script>

<style scoped>
.loginContainer {
  /*学习样式*/
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  padding: 15px 35px 15px 35px;
  width: 360px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
  margin: 10px auto 30px auto;
  text-align: center;
}

.loginRemember {
  margin-bottom: 15px;
}

.el-form-item__content {
  position: relative;
}

.el-image {
  width: 100px;
  position: absolute;

}
</style>