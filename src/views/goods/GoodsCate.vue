<template>
  <div class="goodsCate-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格内容区域 -->
      <tree-table :data="cateList" :columns="columns" stripe show-index index-text="#" border :selection-type="false" :expand-type="false">
        <!-- 定义模板 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: green"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>

        <!-- level模板 -->
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>

        <!-- 编辑和操作的模板 -->
        <template slot="operate" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="editCate(scope)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope)">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination @size-change="pagesizeChange" @current-change="currentpageChange" :current-page="cateListQuery.pagenum" :page-sizes="[5, 8, 15, 20]" :page-size="cateListQuery.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-card>

    <!-- 添加分类弹窗 -->
    <el-dialog title="添加分类" :visible.sync="showAddCate" width="50%" :close-on-click-modal="false" :close-on-press-escape="false" @close="resetAddCate">
      <el-form :model="addCateForm" label-width="80px" :rules="cateRules" ref="addCateRulesRef">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 级联选择器 options指定数据源 -->
          <!-- porps用来指定配置对象 -->
          <el-cascader :options="parentCateList" v-model="selectedKeys" :props="cascaderProps" clearable @change="parentCateChange"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddCate = false">取 消</el-button>
        <el-button type="primary" @click="addCateFn">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑分类弹窗 -->
    <el-dialog title="编辑分类" :visible.sync="showEditCate" width="50%" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="editForm" label-width="80px" :rules="cateRules" ref="editCateRef">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditCate = false">取 消</el-button>
        <el-button type="primary" @click="editCateFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入接口
import { categories, addNewCate, editCate, deleteCate } from '@/api/index.js'
export default {
  name: 'GoodsCate',
  data() {
    return {
      // 查询商品数据分类列表参数
      cateListQuery: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 获取到的商品数据总数
      total: 0,
      // 获取的商品列表
      cateList: [],
      // 为table指定每一列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示将当前列定义为模板列
          type: 'template',
          // 当前列使用的模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 排序模板列
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          // 编辑和删除模板
          type: 'template',
          template: 'operate'
        }
      ],
      // 控制添加分类弹窗显示
      showAddCate: false,
      // 添加分类的表单信息
      addCateForm: {
        // 将要添加的分裂名称
        cat_name: '',
        // 父级分类id
        cat_pid: 0,
        // 分类层级，默认为1级分类
        cat_level: 0
      },
      // 添加分类的表单验证规则
      cateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 商品父级分类列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      // 级联选择器选择的父级分类的id数组
      selectedKeys: [],
      // 控制分类编辑弹窗显示
      showEditCate: false,
      // 编辑分类表单内容
      editForm: {}
    }
  },
  methods: {
    //  获取商品分类列表
    async getCateList() {
      const res = await categories(this.cateListQuery)
      this.total = res.data.data.total
      this.cateList = res.data.data.result
    },
    // pagesize改变
    pagesizeChange(pagesize) {
      this.cateListQuery.pagesize = pagesize
      this.getCateList()
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const res = await categories({ type: 2 })
      console.log(res)
      this.parentCateList = res.data.data
    },
    // 当前页面改变
    currentpageChange(currentpage) {
      this.cateListQuery.pagenum = currentpage
      this.getCateList()
    },
    // 点击添加分类按钮，弹出弹窗
    addCate() {
      this.getParentCateList()
      this.showAddCate = true
    },
    // 级联选择器选项发生变化触发
    parentCateChange() {
      // 如果selectedKeys的长度大于0，说明选择了分类，反之则说明没有选择任何分类
      if (this.selectedKeys.length > 0) {
        // 保存父级id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 保存分类层级
        this.addCateForm.cat_level = this.selectedKeys.length
      }
    },
    // 添加分类，发送请求
    addCateFn() {
      this.$refs.addCateRulesRef.validate(async valid => {
        if (!valid) return this.$message.error('输入名字不合法')
        await addNewCate(this.addCateForm)
        this.showAddCate = false
        this.getCateList()
      })
    },
    // 添加分类弹窗关闭后重置表单
    resetAddCate() {
      this.$refs.addCateRulesRef.resetFields()
    },
    // 点击编辑按钮，存储该行信息
    editCate(scope) {
      this.editForm = scope.row
      this.showEditCate = true
    },
    // 提交编辑信息
    editCateFn() {
      // 对整个表单进行校验
      this.$refs.editCateRef.validate(async valid => {
        if (!valid) return this.$message.error('分类名称错误！')
        await editCate({
          id: this.editForm.cat_id,
          cat_name: this.editForm.cat_name
        })
        this.showEditCate = false
        this.getCateList()
      })
    },
    // 删除分类
    async deleteCate(scope) {
      await deleteCate({ id: scope.row.cat_id })
      this.getCateList()
    }
  },
  async created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.zk-table {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>
