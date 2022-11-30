<template>
  <div class="login-body">
    <div class="login-panel">
      <div class="login-title">用户登录</div>
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <el-form-item prop="account">
          <el-input size="large" placeholder="请输入账号" v-model.trim="formData.account">
            <!-- 引入阿里图标，查阅element的prefix插槽 -->
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" size="large" placeholder="请输入密码" v-model.trim="formData.password">
            <!-- 引入阿里图标，查阅element的prefix插槽 -->
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <div class="check-code-panel">
          <el-form-item prop="checkCode">
            <el-input size="large" class="input-code" placeholder="请输入验证码" v-model.trim="formData.checkCode" />
            <img :src="checkCodeUrl" class="check-code" @click="changeCheckCode">
          </el-form-item>
        </div>
        <div class="code-handle-panel">
          <el-form-item>
            <el-checkbox :model="formData.rememberMe" :label="true">记住密码</el-checkbox>
          </el-form-item>
          <!-- 可以添加忘记密码模块 -->
        </div>
        <el-form-item>
          <el-button type="primary" style="width:100%" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import VueCookies from 'vue-cookies';

const { proxy } = getCurrentInstance();
const api = {
  checkCode: "api/checkCode",
  login: "login",
}
const formData = reactive({
  // account: "",
  // password: "",
  // checkCode: ""
});
const formDataRef = ref();
// 下面使用了请求接口
const checkCodeUrl = ref(api.checkCode)

const changeCheckCode = () => {
  checkCodeUrl.value = api.checkCode + "?" + new Date().getTime();
}

const rules = {
  account: [{
    required: true,
    message: "请输入用户名",
  }],
  password: [{
    required: true,
    message: "请输入密码",
  }],
  checkCode: [{
    required: true,
    message: "请输入验证码",
  }]
}

const login = () => {
  // Request 返回的是一个Promise所以这里使用async修饰
  formDataRef.value.validate(async (valid) => {
    // 先进行简单的输入格式校验
    if (!valid) {
      return;
    }
    let result = await proxy.Request({
      url: api.login,
      params: {
        account: formData.account,
        password: formData.password,
        checkCode: formData.checkCode,
      },
      errorCallBack: () => {
        changeCheckCode();
      }
    })
    if (!result) {
      return;
    }
    // cookie需要保存的用户登录信息
    const loginInfo = {
      account: formData.account,
      password: formData.password,
    }
    VueCookies.set("userInfo", result.data,0)
    if (formData.rememberMe) {
      VueCookies.set("loginInfo", loginInfo, "7d")
    }
  });

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
  margin-right: 15%;
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

  .check-code-panel {
    display: flex;

    .input-code {
      flex: 1;
      margin-right: 10px;
    }

    .check-code {
      flex: 1;
    }
  }

  .code-handle-panel {
    display: flex;
  }

}
</style>