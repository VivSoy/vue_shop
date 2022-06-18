<template>
  <div class="userList-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索添加区域 -->
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList()">
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="showAddUser = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格信息区域 -->
      <el-table border style="width: 100%" stripe :data="userList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" width="180" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <!-- 用户状态选择 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="changeState(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <!-- 对用户进行的编辑、删除操作 -->
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRoles(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页栏 -->
      <el-pagination :current-page="queryInfo.pagenum" :page-size="queryInfo.pagesize" :page-sizes="[2, 4, 6, 10]" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="showAddUser" @close="resetForm" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form label-width="80px" :rules="addUserRules" :model="addUser" ref="addFormRef">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="addUser.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUser.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddUser = false">取 消</el-button>
        <el-button type="primary" @click="addUserFn">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 用户修改信息的对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="showModifyUser" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form label-width="80px" :rules="addUserRules" :model="userInfoById">
        <el-form-item label="用户名">
          <el-input :disabled="true" v-model="userInfoById.username"> </el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入内容" v-model="userInfoById.email"> </el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input placeholder="请输入内容" v-model="userInfoById.mobile"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showModifyUser = false">取 消</el-button>
        <el-button type="primary" @click="ModifyUserFn">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialog" :close-on-press-escape="false" :close-on-click-modal="false" @close="resetSetRoles">
      <div>
        <p>当前的用户：{{ this.userInfo.username }}</p>
        <p>当前的角色：{{ this.userInfo.role_name }}</p>
      </div>
      <el-form>
        <el-form-item label="分配新角色">
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :value="item.id" :label="item.roleName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRolesFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入请求API
import { getUserList, changeUserState, addUsers, getUserById, editUser, deleteUser, getRolesList, setUserRole } from '@/api/index.js'
export default {
  name: 'UserList',
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 6
      },
      // 用户列表
      userList: [],
      // 总共的数据
      total: 0,
      // 控制添加用户对话框的显示
      showAddUser: false,
      // 控制修改用户对话框的显示
      showModifyUser: false,
      // 控制分配角色弹窗的显示
      setRoleDialog: false,
      // 新增用户表单数据
      addUser: {
        name: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 根据id查询到的用户数据
      userInfoById: {},
      // 新增用户表单校验规则
      addUserRules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8个字符', trigger: 'blur' }
        ],
        password: [
          {
            required: true,
            min: 6,
            max: 15,
            message: '请输入6到15位的密码',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: false,
            type: 'email',
            message: '请输入正确的邮箱格式',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: false,
            pattern: /^1[3456789]\d{9}$/,
            message: '请输入11位手机号',
            trigger: 'blur'
          }
        ]
      },
      // 角色列表信息
      rolesList: [],
      // 当前点击的用户的角色信息
      userInfo: {},
      // 分配角色弹窗里下拉菜单选中的角色id值
      selectedRoleId: ''
    }
  },
  methods: {
    // 改变用户状态
    async changeState(user) {
      await changeUserState({
        uid: user.id,
        type: user.mg_state
      })
    },
    // 监听每页条数的改变
    handleSizeChange(newsize) {
      // 用户选择了每页的条数，重新修改queryInfo的数据
      this.queryInfo.pagesize = newsize
      this.getUserList()
    },
    // 监听当前页码的改变
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
    // 获取用户列表
    async getUserList() {
      const res = await getUserList(this.queryInfo) // 利用对象解构赋值
      this.userList = res.data.data.users
      this.total = res.data.data.total
    },
    // 确定添加新用户后向后台发请求
    addUserFn() {
      // 先对整个表单进行预校验
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('添加用户失败！请注意格式哦！')
        const res = await addUsers({
          username: this.addUser.name,
          password: this.addUser.password,
          email: this.addUser.email,
          mobile: this.addUser.mobile
        })
        console.log(res)
        this.showAddUser = false
        this.$message.success('添加用户成功！')
        this.getUserList()
      })
    },
    // 新增用户弹窗关闭后重置表单
    resetForm() {
      this.$refs.addFormRef.resetFields()
    },
    // 对用户信息进行编辑
    async editUser(id) {
      const res = await getUserById(id)
      this.userInfoById = res.data.data
      console.log(this.userInfoById)
      this.showModifyUser = true
    },
    // 编辑用户信息后向后台更改数据
    async ModifyUserFn() {
      await editUser({
        id: this.userInfoById.id,
        email: this.userInfoById.email,
        mobile: this.userInfoById.mobile
      })
      this.showModifyUser = false
      this.getUserList()
    },
    // 删除用户信息
    async deleteUser(id) {
      await deleteUser({
        id: id
      })
      this.$message.success('删除成功！')
      this.getUserList()
    },
    // 分配角色
    async setRoles(user) {
      this.userInfo = user
      // 在展示对话框前获取角色列表
      const res = await getRolesList()
      this.rolesList = res.data.data
      this.setRoleDialog = true
    },
    // 发起分配角色的请求
    async setRolesFn() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
      await setUserRole({
        id: this.userInfo.id,
        rid: this.selectedRoleId
      })
      // 重新渲染页面
      this.getUserList()
      this.setRoleDialog = false
    },
    // 分配角色弹窗关闭后之后重置表单
    resetSetRoles() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  },
  async created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
.el-table {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
