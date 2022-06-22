<template>
  <div class="order-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 订单搜索 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="searchIpt">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表 -->
      <el-table :data="orderList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"> </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="120"> </el-table-column>
        <el-table-column prop="pay_status" label="是否支付" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '0'" type="warning">未支付</el-tag>
            <el-tag v-else>已支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="110"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="200"> </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle size="small" @click="editAdress(scope.row)"></el-button>
            <el-button type="success" icon="el-icon-location" circle size="small" @click="getLogistics()"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="orderInfo.pagenum" :page-sizes="[6, 9, 15]" :page-size="orderInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="orderTotal"> </el-pagination>
    </el-card>

    <!-- 修改地址 -->
    <el-dialog title="修改地址" :visible.sync="showEditAddress">
      <el-form :model="addressForm" :rules="addressFormRules" label-width="100px">
        <!-- 地区选择器 -->
        <el-form-item label="省市区/县" prop="addrselectedAddressess">
          <el-cascader :options="addressOptions" v-model="addressForm.selectedAddress" :props="{ expandTrigger: 'hover' }" @change="saveCity"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="addressForm.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditAddress = false">取 消</el-button>
        <el-button type="primary" @click="showEditAddress = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流信息 -->
    <el-dialog title="物流进度" :visible.sync="showProgress">
      <el-timeline :reverse="true">
        <el-timeline-item v-for="(item, index) in ProgressList" :key="index" :timestamp="item.time">
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
// 地区选择器插件
import { regionData, CodeToText } from 'element-china-area-data'
import { getOrderList, getProgressMsg } from '@/api/index.js'
import { formatTime } from '@/utils/dayFormat.js'
export default {
  name: 'orderMange',
  data() {
    return {
      // 输入框搜索
      searchIpt: '',
      // 订单列表
      orderList: [],
      // 获取订单列表参数
      orderInfo: {
        query: '',
        pagesize: 9,
        pagenum: 1
      },
      // 订单总数
      orderTotal: 0,
      // 控制修改地址弹窗显示
      showEditAddress: false,
      // 地区级联选择器配置
      addressOptions: regionData,
      // 区域码转换
      CodeToText,
      // 修改地址表单信息
      addressForm: {
        address: '',
        // 选定的地址
        selectedAddress: []
      },
      // 表单验证规则
      addressFormRules: {
        addrselectedAddressess: [
          {
            required: true,
            message: '请选择地区',
            trigger: 'blur'
          }
        ],
        address: [
          {
            required: true,
            message: '请填写详细地址',
            trigger: 'blur'
          }
        ]
      },
      // 控制物流进度
      showProgress: false,
      // 物流信息
      ProgressList: []
    }
  },
  methods: {
    formatTime,

    async getOrders() {
      const res = await getOrderList(this.orderInfo)
      if (res.data.meta.status !== 200) {
        this.$message.error('获取订单列表失败')
      }
      res.data.data.goods.forEach(item => {
        item.create_time = formatTime(item.create_time)
      })
      this.orderList = res.data.data.goods
      this.orderTotal = res.data.data.total
      console.log(res)
    },
    // sizechange
    handleSizeChange(size) {
      this.orderInfo.pagesize = size
      this.getOrders()
    },
    // currentpage
    handleCurrentChange(num) {
      this.orderInfo.pagenum = num
      this.getOrders()
    },
    // 获取地址资料
    editAdress() {
      this.showEditAddress = true
    },
    // 存储地址信息
    saveCity() {
      // 将地址编码转化为汉字
      // this.addressForm.selectedAddress = this.addressForm.selectedAddress.map(item => {
      //   return CodeToText[item]
      // })
    },
    // 获取物流信息
    async getLogistics() {
      // 这里没有物流单号，用的模拟数据
      this.showProgress = true
      const res = await getProgressMsg()
      this.ProgressList = res.data.data
    }
  },
  async created() {
    this.getOrders()
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
</style>
