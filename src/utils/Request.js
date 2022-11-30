import axios from 'axios'

const contentTypeForm = "application/x-www-form-urlencoded;charset=UTF-8";
const contentTypeJson = "application/json";
const contentTypeFile = "multipart/form-data";
import { ElLoading, ElMessage } from 'element-plus'
import message from './Message';

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
            ElMessage({
                message: '发送请求失败',
                type: 'error',
            })
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
                return Promise.reject(responseData.info)
            }else{

            }
            return responseData;
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
    //     ElMessage({
    //         message: error,
    //         type: 'error',
    //     })
    // })
    
    // 写法二、
    let result = new Promise((resolve, reject) => {
        instance.post(url,params).then(res => {
            resolve(res);
        }).catch((error)=>{
            ElMessage({
                message: error,
                type: 'error',
            })
        })
    })
    return result;

}

export default request;
