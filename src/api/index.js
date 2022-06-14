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

// 获取左侧菜单权限
export const getMenu = () => {
  return request({
    method: 'GET',
    url: '/menus'
  })
}

// 获取用户数据列表
export const getUserList = ({ query, pagenum, pagesize }) => {
  return request({
    url: '/users',
    method: 'GET',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}

// 修改用户状态
export const changeUserState = ({ uid, type }) => {
  return request({
    url: `users/${uid}/state/${type}`,
    method: 'PUT'
  })
}

// 新增用户
export const addUsers = ({ username, password, email, mobile }) => {
  return request({
    method: 'POST',
    url: '/users',
    data: {
      username,
      password,
      email,
      mobile
    }
  })
}

// 根据id查询用户信息
export const getUserById = id => {
  return request({
    url: `users/${id}`,
    method: 'GET'
  })
}

// 编辑用户提交
export const editUser = ({ id, email, mobile }) => {
  return request({
    url: `users/${id}`,
    method: 'PUT',
    data: {
      email,
      mobile
    }
  })
}

// 删除用户
export const deleteUser = ({ id }) => {
  return request({
    url: `users/${id}`,
    method: 'DELETE'
  })
}
