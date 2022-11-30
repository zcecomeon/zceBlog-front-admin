import axios from 'axios'

const contentTypeForm = "application/x-www-form-urlencoded;charset=UTF-8";
const contentTypeJson = "application/json";
const contentTypeFile = "multipart/form-data";
import { ElLoading } from 'element-plus'

const request = (config) => {
    // 创建一个config对象，对象包含以下这些元素, params成员为一个对象
    const { url, params, dataType, showLoading } = config  
    dataType = dataType ? "form" : dataType;
    showLoading = showLoading ? true : showLoading;

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
    instance.interceptors.request.use(
        (config) => {
            if (showLoading) {
                
                loading =  ElLoading.service({
                    lock: true,
                    text: '加载中......',
                    background: 'rgba(0, 0, 0, 0.7)',
                  })
                //   setTimeout(() => {
                //     loading.close()
                //   }, 2000)
            }
        },
        (error) => {
            if (showLoading && loading) {
                loading.close();
            }
            ElMessage({
                message: '发送请求失败',
                type: 'error',
            })
            return Promise.reject
        }
    )
}

export default request;
