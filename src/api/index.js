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

// 分配用户角色
export const setUserRole = ({ id, rid }) => {
  return request({
    url: `users/${id}/role`,
    method: 'PUT',
    data: {
      rid
    }
  })
}

// 获取权限列表
export const getRightList = ({ type }) => {
  return request({
    url: `rights/${type}`,
    method: 'GET'
  })
}

// 获取角色列表
export const getRolesList = () => {
  return request({
    url: '/roles',
    method: 'GET'
  })
}

// 添加角色
export const addRoles = ({ roleName, roleDesc }) => {
  return request({
    url: '/roles',
    method: 'POST',
    data: {
      roleName,
      roleDesc
    }
  })
}

// 根据角色id查询角色信息
export const getRolesInfo = ({ id }) => {
  return request({
    url: `roles/${id}`,
    method: 'GET'
  })
}

// 编辑角色信息
export const editRole = ({ id, roleName, roleDesc }) => {
  return request({
    url: `roles/${id}`,
    method: 'PUT',
    data: {
      roleName,
      roleDesc
    }
  })
}

// 删除角色
export const deleteRoles = ({ id }) => {
  return request({
    url: `roles/${id}`,
    method: 'DELETE'
  })
}

// 删除角色制定权限
export const deleteRights = ({ roleId, rightId }) => {
  return request({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'DELETE'
  })
}

// 分配角色权限
export const giveRoleRights = ({ roleId, rids }) => {
  return request({
    url: `roles/${roleId}/rights`,
    method: 'POST',
    data: {
      rids
    }
  })
}

// 商品分类管理
export const categories = ({ type, pagenum, pagesize }) => {
  return request({
    url: '/categories',
    methods: 'GET',
    params: {
      type,
      pagenum,
      pagesize
    }
  })
}

// 添加分类
export const addNewCate = ({ cat_pid, cat_name, cat_level }) => {
  return request({
    url: '/categories',
    method: 'POST',
    data: {
      cat_pid,
      cat_name,
      cat_level
    }
  })
}

// 编辑分类
export const editCate = ({ id, cat_name }) => {
  return request({
    url: `categories/${id}`,
    method: 'PUT',
    data: {
      cat_name
    }
  })
}

// 删除分类
export const deleteCate = ({ id }) => {
  return request({
    url: `categories/${id}`,
    method: 'DELETE'
  })
}

// 获取参数列表
export const getAttributesList = ({ id, sel }) => {
  return request({
    url: `categories/${id}/attributes`,
    method: 'GET',
    params: {
      sel
    }
  })
}

// 添加动态参数或者静态属性
export const addParamsOrAttribute = ({ id, attr_name, attr_sel, attr_vals }) => {
  return request({
    url: `categories/${id}/attributes`,
    method: 'POST',
    data: {
      attr_name,
      attr_sel,
      attr_vals
    }
  })
}

// 修改参数名称
export const editParamsOrAttribute = ({ id, attrId, attr_name, attr_sel, attr_vals }) => {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    method: 'PUT',
    data: {
      attr_name,
      attr_sel,
      attr_vals
    }
  })
}

// 删除参数
export const deleteParamsOrAttribute = ({ id, attrid }) => {
  return request({
    url: `categories/${id}/attributes/${attrid}`,
    method: 'DELETE'
  })
}

// 获取商品列表
export const getGoodsList = ({ query, pagenum, pagesize }) => {
  return request({
    url: '/goods',
    method: 'GET',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}

// 添加商品
export const addGoods = ({ goods_name, goods_cat, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs }) => {
  return request({
    url: '/goods',
    method: 'POST',
    data: {
      goods_name,
      goods_cat,
      goods_price,
      goods_number,
      goods_weight,
      goods_introduce,
      pics,
      attrs
    }
  })
}
