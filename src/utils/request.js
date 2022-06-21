// 基于axios封装请求模块
import Axios from 'axios'

import { getToken } from '@/utils/token.js'
import router from '@/router'

// 创建axios实例
const axios = Axios.create({
  baseURL: 'https://lianghj.top:8888/api/private/v1/'
})

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 为发送的请求添加请求头
    config.headers.Authorization = getToken()
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response
  },
  async function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    console.log(error)
    // 状态码未401时，表面登录身份过期，跳转登录页面
    if (error.response.status === (400 || 401)) {
      // MessageBox.warning('身份过期，请重新登录！')
      router.replace('/')
    }
    return Promise.reject(error)
  }
)

// 导出自定义函数，参数解构赋值
export default ({ url, method = 'GET', params, data, headers }) => {
  return axios({
    url: url,
    method: method,
    params: params,
    data: data,
    headers: headers
  })
}
