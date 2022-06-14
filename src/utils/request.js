// 基于axios封装请求模块
import Axios from 'axios'

import { getToken } from '@/utils/token.js'

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
