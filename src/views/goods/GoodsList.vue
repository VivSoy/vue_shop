<template>
  <div class="list-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加商品-->
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="goodSearch" clearable @clear="searchGood">
            <el-button slot="append" icon="el-icon-search" @click="searchGood"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="$router.push('goods/add')">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品表格数据 -->
      <el-table :data="goodsList.goods" style="width: 100%" border>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="价格(元）" width="120"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="120"> </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180"> </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGood(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="sizeChangeFn" @current-change="currentChangeFn" :current-page="goodListInfo.pagenum" :page-sizes="[5, 7, 15, 20]" :page-size="goodListInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="goodsList.total"> </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList, deleteGoods } from '@/api/index.js'
// 时间处理模块
import { formatTime } from '@/utils/dayFormat.js'
export default {
  name: 'GoodsList',
  data() {
    return {
      // 商品搜索内容
      goodSearch: '',
      // 商品表格数据
      goodsList: {},
      // 获取商品列表参数
      goodListInfo: {
        query: '',
        pagenum: 1,
        pagesize: 7
      },
      formatTime
    }
  },
  methods: {
    // 获取商品列表
    async getList() {
      const res = await getGoodsList(this.goodListInfo)
      console.log(res)
      this.goodsList = res.data.data
      // 将数据中的时间格式化
      this.goodsList.goods.forEach(item => {
        item.add_time = formatTime(item.add_time)
      })
    },
    // 分页sizechange
    sizeChangeFn(pagesize) {
      this.goodListInfo.pagesize = pagesize
      this.getList()
    },
    // current change
    currentChangeFn(currentpage) {
      this.goodListInfo.pagenum = currentpage
      this.getList()
    },
    // serach goods by keywords
    searchGood() {
      this.goodListInfo.query = this.goodSearch
      this.getList()
    },
    // 删除商品
    async deleteGood(goods_id) {
      await deleteGoods({ id: goods_id })
      this.getList()
    }
  },
  async created() {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
</style>
