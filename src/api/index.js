// 统一管理api接口

// 导入request模块
import request from '@/utils/request.js'

// 登录接口
export const loginApi = (username, password) => {
  return request({
    method: 'POST',
    url: '/login',
    data: {
      username,
      password
    }
  })
}
