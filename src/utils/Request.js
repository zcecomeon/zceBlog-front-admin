import axios from 'axios'

const contentTypeForm = "application/x-www-form-urlencoded;charset=UTF-8";
const contentTypeJson = "application/json";
const contentTypeFile = "multipart/form-data";
import { ElLoading, ElMessage } from 'element-plus'
import message from './Message';
import router from '../router';

const request = (config) => {
    // debugger
    // 创建一个config对象，对象包含以下这些元素, params成员为一个对象
    // 注意dataType和showLoading在某些请求中需要给出默认值
    const { url, params, dataType, showLoading } = config  
    // dataType = dataType ? "form" : dataType;
    // showLoading = showLoading ? true : showLoading;

    let contentType = contentTypeForm;
    if (dataType === "json") {
        contentType = contentTypeJson;
    }else if (dataType === "file") {
        contentType = contentTypeFile;

        // 注意：附带的额外参数，将其带入
        let param = new FormData();
        for (let key in params) {
            param.append(key, params[key]);
        }
        params = param;
    }

    const instance = axios.create({
        baseURL: '/api',
        timeout: 10 * 1000,
        headers: {
            'Content-Type': contentType,
            'X-Requested-With': 'XMLHttpRequest',
        },
    })

    let loading = null;
    // 请求前拦截
    instance.interceptors.request.use(
        (config) => {
            if (showLoading) {
                loading =  ElLoading.service({
                    lock: true,
                    text: '加载中......',
                    background: 'rgba(0, 0, 0, 0.7)',
                  })
            }
            return config;
        },
        (error) => {
            if (showLoading && loading) {
                loading.close();
            }
            message.error("发送请求失败")
            return Promise.reject("发送请求失败")
        }
    )
    // 请求后拦截
    instance.interceptors.response.use(
        (response) => {
            if (showLoading && loading) {
                loading.close();
            }
            const responseData = response.data;
            if (responseData.status == "error") {
                // message.error(responseData.info)

                // 请求拦截会拦截各种请求，当我们登陆时，会传一个参数其中就有errorCallBack函数，
                // 若该函数存在表示需要执行回调函数动态刷新验证码
                if (config.errorCallBack) {
                    config.errorCallBack();
                }

                return Promise.reject(responseData.info)
                // return responseData;
            }else{
                // 后端根据请求返回的状态码不同，由此设置不同的返回状态
                if (responseData.code == 200) {
                    return responseData;
                } else if (responseData.code == 901) {
                    // 登录超时，页面跳转到登录页
                    setTimeout( () =>{
                        router.push("/login")
                    },2000);
                    return Promise.reject("登录超时")
                }
                
            }
            
        },
        (error) => {
            if (showLoading && loading) {
                loading.close();
            }
            return Promise.reject("网络异常")
        }
    )

    // 写法一、
    // return Promise.post(url,params).catch(error => {
    //     message.error(error)
    //     return null;
    // })
    
    // 写法二、无法取得返回值，不推荐
    let result = new Promise((resolve, reject) => {
        instance.post(url,params).then(res => {
            return resolve(res);
        }).catch((error)=>{
            ElMessage({
                message: error,
                type: 'error',
            })
        })
    })

}

export default request;
