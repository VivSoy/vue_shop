<template>
  <div class="login-container">
    <!-- 登录组件 -->
    <div class="login-box">
      <!-- 登录logo -->
      <div class="login-log">
        <img src="../assets/logo.png" alt="" />
      </div>

      <!--登录表单 -->
      <el-form label-width="0" class="login_form" :model="form" :rules="login_rules" ref="ruleLoginForm">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" prefix-icon="el-icon-user" autofocus></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input placeholder="请输入密码" v-model="form.password" show-password prefix-icon="el-icon-s-tools"></el-input>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="submitForm">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 导入用户登录API
import { loginApi } from '@/api/index.js'
// 导入保存token的方法
import { setToken } from '@/utils/token.js'
export default {
  name: 'MyLogin',
  data() {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      login_rules: {
        // 用户名校验
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 5,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ],
        // 密码规则校验
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 登录操作
    submitForm() {
      this.$refs.ruleLoginForm.validate(async val => {
        if (!val) return
        // 表单校验成功，调用请求
        const res = await loginApi(this.form.username, this.form.password)
        console.log(res)
        if (res.status !== 200) return this.$message.error('登录失败')
        setToken(res.data.data.token)
        this.$router.push('/home')
        this.$message.success('登陆成功')
      })
    },
    // 将表单重置为初始值
    resetForm() {
      this.$refs.ruleLoginForm.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;

  .login-box {
    background-color: #fff;
    width: 450px;
    height: 300px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 3px;

    .login-log {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      border: 1px solid #eee;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    .login_form {
      width: 100%;
      position: absolute;
      bottom: 0;
      padding: 0 20px;
      box-sizing: border-box;

      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
