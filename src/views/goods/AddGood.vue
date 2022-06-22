<template>
  <div class="addGood-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加卡片 -->
    <el-card>
      <!-- 消息提示 -->
      <el-alert title="添加商品信息" center :closable="false" type="info" show-icon> </el-alert>

      <!-- 步骤条 -->
      <el-steps :active="activeStep - 0" align-center>
        <el-step title="步骤1" description="基本信息"></el-step>
        <el-step title="步骤2" description="商品参数"></el-step>
        <el-step title="步骤3" description="商品属性"></el-step>
        <el-step title="步骤4" description="商品图片"></el-step>
        <el-step title="步骤5" description="商品内容"></el-step>
        <el-step title="步骤6" description="完成"></el-step>
      </el-steps>

      <!-- form表单置于最外层，便于获取所有tabs的表单数据 -->
      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px" label-position="top">
        <!-- tab标签页 -->
        <el-tabs tab-position="left" v-model="activeStep" :before-leave="beforeTabLeave" @tab-click="tabsChecked">
          <!-- 基本信息填写 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number" min="0"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_number" type="number" min="0"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_weight" type="number" min="0"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :props="cateProps" :options="cateList" clearable @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in activeParams" :key="item.attr_id">
              <el-checkbox-group v-model="checkedParams">
                <el-checkbox v-for="(item2, index) in item.attr_vals" :key="index" :label="item2" border checked></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in staticAttribute" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示图片上传到的后台api地址 -->
            <el-upload :action="upLoad" :on-preview="handlePreview" :on-success="handleSuccess" :on-remove="handleRemove" list-type="picture" :headers="headersObj">
              <el-button type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addGoodFn">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewDialog" width="30%">
      <img :src="previewPath" alt="" />
    </el-dialog>
  </div>
</template>

<script>
// 引入深拷贝插件
import _ from 'lodash'

// 局部引入富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

// 引入接口
import { categories, getAttributesList, addGoods } from '@/api/index.js'
export default {
  name: 'AddGood',
  components: {
    quillEditor
  },
  data() {
    return {
      // 控制步骤条与tabs的联动
      activeStep: '0',
      // 添加产品表单校验规则
      addRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          },
          {
            required: true,
            min: 2,
            max: 30,
            message: '请输入2-30位字符',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur'
          }
        ],
        goods_cat: [
          {
            required: true,
            message: '请输入商品分类',
            trigger: 'blur'
          }
        ]
      },
      // 添加表单内容
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        attrs: [] /* 参数和属性 */,
        pics: [],
        goods_introduce: ''
      },
      // 获取商品分类的结构
      cateList: [],
      // 级联选择器配置项
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 动态参数
      activeParams: [],
      // 勾选过的动态参数 attr_vals
      checkedParams: [],
      // 静态属性
      staticAttribute: [],
      // 图片上传地址
      upLoad: 'https://lianghj.top:8888/api/private/v1/upload',
      // 图片上传的headers
      headersObj: {
        Authorization: localStorage.getItem('Token')
      },
      // 图片预览地址
      previewPath: '',
      // 预览窗口的显示
      previewDialog: false
    }
  },
  methods: {
    // 获取商品分类列表
    async getCate() {
      const res = await categories({ type: '', pagenum: '', pagesize: '' })
      this.cateList = res.data.data
    },
    // 级联选择器发生变化时触发
    handleChange() {
      // 如果选择的不是第三级分类，将不予保存
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
      // 清空勾选过的参数，防止回退操作多次存储动态参数
      this.checkedParams = []
    },
    // tab页切换前的钩子函数
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类！')
        return false
      }
    },
    // tab栏被选中时触发
    async tabsChecked() {
      if (this.activeStep === '1') {
        const res = await getAttributesList({
          id: this.addForm.goods_cat[2],
          sel: 'many'
        })
        res.data.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.activeParams = res.data.data
      } else if (this.activeStep === '2') {
        const res = await getAttributesList({
          id: this.addForm.goods_cat[2],
          sel: 'only'
        })
        this.staticAttribute = res.data.data
      }
    },
    // 处理图片预览事件
    handlePreview(file) {
      // 存储预览地址
      this.previewPath = file.response.data.url
      this.previewDialog = true
    },
    // 移除以上传的图片
    handleRemove(file) {
      // 获取移除图片的临时路径
      const removepic = file.response.data.tmp_path
      // 得到图片在pics数组中的索引值 (难点)
      const index = this.addForm.pics.findIndex(x => x.pic === removepic)
      // splice移除图片
      this.addForm.pics.splice(index, 1)
    },
    // 图片上传成功事件
    handleSuccess(response) {
      console.log(response)
      // 拼接一个图片对象
      const picInfo = {
        pic: response.data.tmp_path
      }
      // 将图片对象存入addForm.pics中
      this.addForm.pics.push(picInfo)
    },
    // 添加商品
    addGoodFn() {
      /* 难点 */
      this.$refs.addFormRef.validate(async valid => {
        // 表单校验
        if (!valid) {
          this.$message.error('请填写必要的表单项')
        }
        // 执行添加业务逻辑
        // 由于多个表单双向绑定addForm数据，发起请求中goods_cat，attrs为字符串，直接改动会影响到原页面，并报错，所以采用深拷贝
        const form = _.cloneDeep(this.addForm)
        // 将good_cat转化为字符串
        form.goods_cat = form.goods_cat.join(',')
        // 设置attrs参数
        // 处理动态参数
        this.activeParams.forEach(item => {
          const newInfo = {}
          // 传入id
          newInfo.attr_id = item.attr_id
          // 是渲染的动态属性tag同步选中的参数，否则点击其他步骤再返回会重置
          item.attr_vals = this.checkedParams
          // 将被选中的动态参数转换为字符串重新赋与newInfo.attr_vals
          newInfo.attr_vals = this.checkedParams.join(' ')
          form.attrs.push(newInfo)
        })
        // 处理静态属性
        this.staticAttribute.forEach(item => {
          const newInfo = {}
          newInfo.attr_id = item.attr_id
          newInfo.attr_vals = item.attr_vals
          form.attrs.push(newInfo)
        })
        // 发送添加商品请求
        const res = await addGoods(form)
        if (res.data.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  created() {
    this.getCate()
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin-top: 15px;
}

.el-tabs {
  margin-top: 30px;
}

.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.quill-editor {
  margin-bottom: 15px;
}
</style>
