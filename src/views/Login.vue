<template>
  <div class="login-body">
    <div class="login-panel">
      <div class="login-title">用户登录</div>
      <el-form 
      :model="formData"
      :rules="rules"
       ref="formDataRef">
        <el-form-item prop="account">
          <el-input size="large" placeholder="请输入账号" :model="formData.account">
          <template #prefix>
            <span class="iconfont icon-account"></span>
          </template>
        </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input size="large" placeholder="请输入密码" :model="formData.password">
          <template #prefix>
            <span class="iconfont icon-password"></span>
          </template>
        </el-input>
        </el-form-item>
        <div class="check-code-panel">
          <el-form-item prop="checkCode" >
            <el-input size="large" class="input-code" placeholder="请输入验证码" :model="formData.checkCode" />
            <img :src="checkCodeUrl" class="check-code" @click="changeCheckCode">
          </el-form-item>
        </div>
        <el-form-item label="记住密码">
          <el-checkbox :model="formData.rememberMe" :label="true">记住密码</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const api = {
  checkCode: "api/checkCode"
}
const formData = reactive({});
const formDataRef = ref();
// 下面使用了请求接口
const checkCodeUrl = ref(api.checkCode)

const changeCheckCode = () =>{
  checkCodeUrl.value = api.checkCode + "?" + new Date().getTime();
}

const rules = {
  account:[{
    required: true,
    message: "请输入用户名",
  }],
}

const login = () => {
  formDataRef.value.validate((valid) => {
    if (!valid) {
      return;
    }
  })

}
</script>

<style lang="scss">
.login-body {
  width: 100%;
  height: calc(100vh);
  background-size: cover;
  background-position: center;
  background-image: url('../assets/loginBackgroud.jpg');
}

.login-panel {
  margin-top: 10%;
  margin-right: 35%;
  padding: 20px;
  float: right; //靠右浮漂
  width: 350px;
  background: rgb(245, 240, 240, 0.8);
  border-radius: 10px; //边框圆角
  box-shadow: 5px 5px 20px #888; //设置阴影

  .login-title {
    font-size: 30px;
    text-align: center;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .check-code-panel{
    display: flex;
    .input-code{
      flex: 1;
      margin-right: 10px;
    }
    .check-code{
      flex: 1;
    }
  }

}
</style>