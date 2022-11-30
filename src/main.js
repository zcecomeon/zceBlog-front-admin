import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router' 

import "element-plus/dist/index.css"
import ElementPlus from 'element-plus'

// 引入阿里icon
import "@/assets/icon/iconfont.css"

import Request from '@/utils/Request'
const app = createApp(App);
app.use(router);
app.use(ElementPlus)
app.config.globalProperties.Request = Request;
app.mount('#app')
