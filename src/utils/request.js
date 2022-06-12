// 基于axios封装请求模块
import Axios from 'axios'

// 创建axios实例
const axios = Axios.create({
  baseURL: 'https://lianghj.top:8888/api/private/v1/'
})

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
