// token统一管理

const key = 'Token'

// 设置token
export const setToken = token => {
  localStorage.setItem(key, token)
}

// 获取token
export const getToken = () => {
  localStorage.getItem(key)
}

// 移除token
export const removeToken = () => {
  localStorage.removeToken(key)
}
