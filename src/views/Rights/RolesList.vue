<template>
  <div class="roles-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddRoles = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- table展开行 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', index === 0 ? 'bdtop' : '', 'vcenter', 'firstRight']" v-for="(item, index) in scope.row.children" :key="item.id">
              <!-- 第一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRight(scope.row, item.id)">{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 第二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环，嵌套渲染二级权限 -->
                <el-row :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, index2) in item.children" :key="item2.id">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag closable type="success" @close="removeRight(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" closable v-for="item3 in item2.children" :key="item3.id" @close="removeRight(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="small" @click="RolesInfo(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteRoles(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="small" @click="assignRight(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色弹出层 -->
    <el-dialog title="添加角色" :visible.sync="showAddRoles" @close="resetForm" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="addRolesform" label-width="80px" :rules="addRolesRules" ref="addRolesRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesform.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDsc">
          <el-input v-model="addRolesform.roleDsc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddRoles = false">取 消</el-button>
        <el-button type="primary" @click="addRolesFn">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑角色弹出层 -->
    <el-dialog title="编辑角色" :visible.sync="showEditRoles" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="getRolesById" label-width="80px" :rules="addRolesRules" ref="editRolesRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="getRolesById.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDsc">
          <el-input v-model="getRolesById.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditRoles = false">取 消</el-button>
        <el-button type="primary" @click="editRolesFn">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限弹出层 -->
    <el-dialog title="分配权限" :visible.sync="showAssignRights" :close-on-click-modal="false" @close="clearArr" :close-on-press-escape="false">
      <!-- 树形控件 -->
      <el-tree show-checkbox :data="rightsList" node-key="id" :props="rightsProps" :default-checked-keys="checkedRights" default-expand-all ref="treeRef"></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAssignRights = false">取 消</el-button>
        <el-button type="primary" @click="assignRightsFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入获取角色列表的接口
import { getRolesList, addRoles, getRolesInfo, editRole, deleteRoles, deleteRights, getRightList, giveRoleRights } from '@/api/index.js'
export default {
  name: 'RolesList',
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 控制添加角色的弹窗显示
      showAddRoles: false,
      // 添加角色表单
      addRolesform: {
        roleName: '',
        roleDsc: ''
      },
      // 添加角色表单校验规则
      addRolesRules: {
        roleName: [
          {
            required: true,
            min: 3,
            max: 8,
            trigger: 'blur'
          }
        ],
        roleDsc: [
          {
            type: 'string',
            required: false,
            trigger: 'blur'
          }
        ]
      },
      // 根据角色id获取角色信息
      getRolesById: {},
      // 控制角色修改弹窗的显示
      showEditRoles: false,
      // 控制分配权限窗口显示
      showAssignRights: false,
      // 角色权限列表
      rightsList: [],
      // 渲染树形结构层级名
      rightsProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认树形结构勾选的节点，即当前用户已有的权限
      checkedRights: [],
      // 分配权限时用户选择的所有节点的id值，包括被勾选和半勾选
      rightKeys: [],
      // 存取分配权限时选中的角色id
      rolesId: ''
    }
  },
  methods: {
    // 封装获取角色列表并渲染页面的函数
    async getRoles() {
      const res = await getRolesList()
      console.log(res)
      this.rolesList = res.data.data
    },
    // 添加角色
    async addRolesFn() {
      // 对整个表单进行校验
      this.$refs.addRolesRef.validate(async vaild => {
        if (!vaild) return this.$message.error('输出格式错误,请重新尝试')
        const res = await addRoles({
          roleName: this.addRolesform.roleName,
          roleDesc: this.addRolesform.roleDsc
        })
        console.log(res)
        this.showAddRoles = false
        this.getRoles()
      })
    },
    // 添加角色弹窗消失后重置表单
    resetForm() {
      this.$refs.addRolesRef.resetFields()
    },
    // 通过接口获取角色信息
    async RolesInfo(id) {
      const res = await getRolesInfo({ id: id })
      this.getRolesById = res.data.data
      this.showEditRoles = true
    },
    // 编辑角色信息
    editRolesFn() {
      // 对整个编辑表单进行校验
      this.$refs.editRolesRef.validate(async valid => {
        if (!valid) return this.$message.warning('修改失败哦！')
        await editRole({
          id: this.getRolesById.roleId,
          roleName: this.getRolesById.roleName,
          roleDesc: this.getRolesById.roleDesc
        })
        this.showEditRoles = false
        this.getRoles()
      })
    },
    // 删除角色
    async deleteRoles(id) {
      const confirmResult = await this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除角色')
      }
      await deleteRoles({ id: id })
      this.getRoles()
    },
    // 删除权限
    async removeRight(role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const res = await deleteRights({ roleId: role.id, rightId })
      console.log(res)
      role.children = res.data.data // 巧妙用法，直接将删除后的最新权限数据重新赋予role.children
    },
    // 在权限弹窗中渲染所有权限
    async assignRight(firstNodes) {
      this.showAssignRights = true
      // 获取树形权限列表
      const res = await getRightList({ type: 'tree' })
      this.rightsList = res.data.data
      // 将当前选择角色所拥有的权限id传入checkedRights数组中   难点：怎样获得第二层和第三层权限的id  解决：只需要获得最后一层的权限id即可
      this.getLeafKeys(firstNodes, this.checkedRights)
      // 保存当前选择角色的id
      this.rolesId = firstNodes.id
      console.log(res)
    },
    // 定义一个递归的函数，将角色下的最后一级权限id通过递归获取并保存在新数组里
    getLeafKeys(node, arr) {
      // 如果当前节点不包括children属性，则是最后一级权限，将id值保存在arr中
      if (!node.children) {
        return arr.push(node.id)
      }
      // 如果当前节点保存children属性，遍历数组，递归getLeafKeys()函数
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 调接口修改角色权限
    async assignRightsFn() {
      // 将被选择的节点和半选中的节点的数组拼接在rightKeys中
      // this.rightKeys = this.$refs.treeRef.getHalfCheckedKeys().concat(this.$refs.treeRef.getCheckedKeys(true))
      // 更妙的方法，使用剩余参数
      this.rightKeys = [...this.$refs.treeRef.getHalfCheckedKeys(), ...this.$refs.treeRef.getCheckedKeys()]
      await giveRoleRights({
        roleId: this.rolesId,
        rids: this.rightKeys.toString()
      })
      console.log(this.rightKeys)
      this.$message.success('分配权限成功！')
      this.getRoles()
      this.showAssignRights = false
    },
    // 在分配权限接口关闭时需清空数组
    clearArr() {
      this.checkedRights = []
      this.rightKeys = []
    }
  },
  async created() {
    this.getRoles()
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 7px;
}

.firstRight {
  margin: 0 45px;
}

.bdtop {
  border-top: 1px solid #eee;
}

// 一级二级权限垂直居中
.vcenter {
  display: flex;
  align-items: center;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>
