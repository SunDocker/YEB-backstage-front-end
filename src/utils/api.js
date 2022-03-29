import axios from "axios";
import {Message} from "element-ui";
import router from "@/router";

//请求拦截器
axios.interceptors.request.use(config => {
    //如果存在token，则所有请求都携带token
    if (window.sessionStorage.getItem("tokenStr")) {
        //这个Authorization是和后端定好的，自己加在请求头中的字段
        config.headers.Authorization = window.sessionStorage.getItem("tokenStr")
    }
    return config
}, error => {
    Message.error('请求出错了！')
    alert(error)
})

//响应拦截器
axios.interceptors.response.use(response => {
        //业务逻辑错误
        if (response.status && response.status === 200) {
            if (response.data.code === 500 || response.data.code === 401 || response.data.code === 403) {
                Message.error(response.data.message);
                return;
            }
            if (response.data.message) {
                Message.success(response.data.message)
            }
        }
        return response.data
    },
    error => {
        //响应错误
        if (error.response.code === 504 || error.response.code === 404) {
            Message.error('服务器被吃了o(╯□╰)o');
        } else if (error.response.code === 403) {
            Message.error('权限不足，请联系管理员');
        } else if (error.response.code === 401) {
            Message.error('尚未登录，请登录')
            router.replace('/')
        } else if (error.response.data.message) {
            Message.error(error.response.data.message)
        } else {
            Message.error('未知错误')
        }
        return
    }
)
axios.defaults.baseURL = ''
//传送JSON格式的post请求
export const postRequest = (url, params) => {
    return axios.post(url, params)
}
//传送JSON格式的put请求
export const putRequest = (url, params) => {
    return axios.put(url, params)
}
//传送JSON格式的get请求
export const getRequest = (url, params) => {
    return axios.get(url, params)
}
//传送JSON格式的delete请求
export const deleteRequest = (url, params) => {
    return axios.delete(url, params)
}

