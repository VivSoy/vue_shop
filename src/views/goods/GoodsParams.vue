<template>
  <div class="params-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 警告提示 -->
      <el-alert title="注意:只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon> </el-alert>

      <!-- 商品分类选择 -->
      <div class="cascader">
        <span>选择商品分类:</span>
        <el-cascader :options="goodsCateList" v-model="cateKeys" :props="paramsCascaderProps" clearable @change="cateKeysChange"></el-cascader>
      </div>

      <!-- 动态参数和属性展示 -->
      <el-tabs v-model="activeName">
        <!-- 动态参数选项 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDiasbled" @click="showAddParams = true">添加参数</el-button>
          <el-table :data="dynamicParams" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag type="primary" closable v-for="(item, index) in scope.row.attr_vals" :key="index" @close="closeTagFn(index, scope.row)">{{ item }}</el-tag>
                <!-- 添加新标签 -->
                <el-input class="input-new-tag" v-if="scope.row.showInput" v-model="scope.row.tagValue" ref="tagInput" size="small" @keyup.enter.native="addNewTag(scope.row)" @blur="addNewTag(scope.row)"> </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInputFn(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditParamsDialog(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态属性选项 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDiasbled" @click="showAddParams = true">添加属性</el-button>
          <el-table :data="staticParams" border>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag type="primary" closable v-for="(item, index) in scope.row.attr_vals" :key="index" @close="closeTagFn(index, scope.row)">{{ item }}</el-tag>
                <!-- 添加新标签 -->
                <el-input class="input-new-tag" v-if="scope.row.showInput" v-model="scope.row.tagValue" ref="tagInput" size="small" @keyup.enter.native="addNewTag(scope.row)" @blur="addNewTag(scope.row)"> </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInputFn(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditParamsDialog(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数弹窗 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="showAddParams" width="50%" :close-on-click-modal="false" :close-on-press-escape="false" @close="resetAddParams">
      <el-form :model="addParamsForm" label-width="80px" ref="addParamsRef" :rules="addRules">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddParams = false">取 消</el-button>
        <el-button type="primary" @click="addParamsFn">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改参数弹窗 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="showEditParams" width="50%" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="editParamsForm" label-width="80px" ref="editParamsRef" :rules="addRules">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditParams = false">取 消</el-button>
        <el-button type="primary" @click="editParamsFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAttributesList, categories, addParamsOrAttribute, editParamsOrAttribute, deleteParamsOrAttribute } from '@/api/index.js'
export default {
  name: 'GoodsParams',
  data() {
    return {
      // 商品分类列表
      goodsCateList: [],
      // 级联选择器配置
      paramsCascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 存储标签页的选择对象
      activeName: 'many',
      // 级联选择器当前选中的分类id
      cateKeys: [],
      // 获取的动态参数列表
      dynamicParams: [],
      // 静态属性列表
      staticParams: [],
      // 更改按钮的禁用
      isBtnDiasbled: true,
      // 控制动态参数弹窗的显示
      showAddParams: false,
      // 添加动态参数表单动态绑定
      addParamsForm: {
        attr_name: ''
      },
      // 添加参数和属性的表单验证规则
      addRules: {
        attr_name: [
          {
            required: true,
            min: 2,
            max: 6,
            message: '请输入2-6位字符',
            trigger: 'blur'
          }
        ]
      },
      // 修改参数弹窗显示
      showEditParams: false,
      // 修改参数表单信息
      editParamsForm: {
        attr_name: '',
        attr_id: ''
      }
    }
  },
  computed: {
    // 通过标签页的选中对象展现不同的弹窗
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  methods: {
    // 获取商品分类列表
    async getGoodsCateList() {
      const res = await categories({ type: 3, pagenum: '', pagesize: '' })
      this.goodsCateList = res.data.data
    },
    // 获取动态参数列表
    async getDynamicAttributes() {
      const res = await getAttributesList({
        id: this.cateKeys[this.cateKeys.length - 1],
        sel: 'many'
      })
      // 将数据中的tag标签属性值从字符串转化成数组，便于后面循环渲染
      res.data.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 添加自定义属性，控制当前行的添加tag文本框的显示和隐藏
        item.showInput = false
        // 文本框中的值
        item.tagValue = ''
      })
      this.dynamicParams = res.data.data
    },
    // 获取静态参数列表
    async getStaticAttributes() {
      const res = await getAttributesList({
        id: this.cateKeys[this.cateKeys.length - 1],
        sel: 'only'
      })
      res.data.data.forEach(item => {
        // 对标签内容进行判断，如果为空，返回[]，这样就不会被渲染
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 添加自定义属性，控制当前行的添加tag文本框的显示和隐藏
        item.showInput = false
        // 文本框中的值
        item.tagValue = ''
      })
      this.staticParams = res.data.data
    },
    // 级联选择器选中节点变化时触发
    cateKeysChange() {
      this.getDynamicAttributes()
      this.getStaticAttributes()
      if (this.cateKeys.length !== 3) {
        this.cateKeys = []
        this.isBtnDiasbled = true
      } else {
        this.isBtnDiasbled = false
      }
    },
    // 保存scope.row.attr_vals,用户操作标签的添加和删除
    async saveAttr_vals(attr) {
      // 发送请求，修改后台数据
      await editParamsOrAttribute({
        id: this.cateKeys[this.cateKeys.length - 1],
        attrId: attr.attr_id,
        attr_name: attr.attr_name,
        attr_sel: this.activeName,
        attr_vals: attr.attr_vals.join(' ')
      })
    },
    // 按下回车键或表单失去焦点时添加tag
    async addNewTag(attr) {
      // 如果输入为空，直接return
      if (attr.tagValue.trim().length === 0) {
        attr.tagValue = ''
        attr.showInput = false
        return
      }
      // 输入合法
      attr.attr_vals.push(attr.tagValue.trim())
      attr.tagValue = ''
      // 发送请求，修改后台数据
      this.saveAttr_vals(attr)
      this.$message.success('添加参数成功！')
      attr.showInput = false
    },
    // 点击添加tag自动聚焦
    showInputFn(attr) {
      attr.showInput = true
      // nextTick当页面元素重新渲染之后，才会执行回调中的函数
      this.$nextTick(_ => {
        this.$refs.tagInput.$refs.input.focus()
      })
      // attr.attr_vals.push(this.tagValue)
      // this.tagValue = ''
    },
    // 删除tag
    closeTagFn(index, attr) {
      // 数组操作，截断删除的tag
      attr.attr_vals.splice(index, 1)
      this.saveAttr_vals(attr)
      this.$message.success('删除参数成功！')
    },
    // 对添加表单进行验证发送请求
    addParamsFn() {
      this.$refs.addParamsRef.validate(async valid => {
        if (!valid) return this.$message.warning('输入参数名称不符合规范！')
        // 发请求
        await addParamsOrAttribute({
          id: this.cateKeys[this.cateKeys.length - 1],
          attr_name: this.addParamsForm.attr_name,
          attr_sel: this.activeName,
          attr_vals: ''
        })
        if (this.activeName === 'many') {
          this.getDynamicAttributes()
        }
        this.getStaticAttributes()
        this.showAddParams = false
      })
    },
    // 弹窗关闭后表单重置
    resetAddParams() {
      this.$refs.addParamsRef.resetFields()
    },
    // 展示修改参数对话框
    showEditParamsDialog(row) {
      this.editParamsForm.attr_name = row.attr_name
      this.editParamsForm.attr_id = row.attr_id
      this.showEditParams = true
    },
    // 发送请求，修改参数名称
    editParamsFn() {
      this.$refs.editParamsRef.validate(async valid => {
        if (!valid) return this.$message.warning('输入参数名称不符合规范！')
        await editParamsOrAttribute({
          id: this.cateKeys[this.cateKeys.length - 1],
          attrId: this.editParamsForm.attr_id,
          attr_name: this.editParamsForm.attr_name,
          attr_sel: this.activeName,
          attr_vals: ''
        })
        if (this.activeName === 'many') {
          this.getDynamicAttributes()
        }
        this.getStaticAttributes()
        this.showEditParams = false
      })
    },
    // 删除参数
    async deleteParams(attr_id) {
      await deleteParamsOrAttribute({
        id: this.cateKeys[this.cateKeys.length - 1],
        attrid: attr_id
      })
      this.$message.success('删除成功')
      if (this.activeName === 'many') {
        this.getDynamicAttributes()
      }
      this.getStaticAttributes()
    }
  },
  created() {
    this.getGoodsCateList()
  }
}
</script>

<style lang="less" scoped>
.cascader {
  margin-top: 15px;
  span {
    font-size: 12px;
    margin-right: 10px;
  }
}

.el-tabs {
  margin-top: 15px;
}

.el-table {
  margin-top: 15px;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 20px;
}

.el-tag {
  margin-right: 20px;
}
</style>
