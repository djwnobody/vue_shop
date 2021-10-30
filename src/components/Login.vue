<template>
  <div class="login_container">
    <!-- 登录盒子 -->
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单 -->
      <el-form :model="loginForm" ref="loginFormRef" :rules="loginFormRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model='loginForm.username' prefix-icon='iconfont icon-user'></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model='loginForm.password' prefix-icon='iconfont icon-3702mima' type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click='login'>登录</el-button>
          <el-button type="info" @click='resetLoginForm'>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name:'Login',
  data(){
    return {
      loginForm:{
        username: 'admin',
        password: '123456'
      },
      // 表单的验证规则对象
      loginFormRules: {
        username:[
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min:6, max: 11, message: '长度在 6 到 11 个字符', trigger: 'blur'},
        ]
      }
    }
  },
  methods:{
    resetLoginForm(){
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login(){
      this.$refs.loginFormRef.validate(async (valid)=>{
        if(!valid) return;
        const {data:res} =await this.$http.post('login',this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败');
        this.$message.success('登录成功')
        // console.log(res);
        // 登陆成功之后的操作
        window.sessionStorage.setItem('token',res.data.token)
        // 导航至home组件
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped>
  .login_container {
    height: 100%;
    background-color: #2b4b6b;
  }
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border-radius: 10px;
  }
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    box-shadow: 0 0 10px #000;
  }
  .avatar_box img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  /* 表单 */
  .login_form {
    position: absolute;
    /* background-color: pink; */
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .login_form .btns {
    /* background-color: purple; */
    display: flex;
    justify-content: flex-end;
  }
</style>
