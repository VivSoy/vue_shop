<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="header-log">
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container>
      <!-- 左侧侧边栏区域 -->
      <el-aside :width="this.isCollapse ? '70px' : '200px'" ref="aside">
        <!-- 设置折叠菜单按钮 -->
        <div class="toggle-button" @click="toggleMenu">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b" unique-opened :collapse-transition="false" :collapse="isCollapse" router :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveActivPath('/' + subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- 右侧主体区域 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
// 移除token
import { removeToken } from '@/utils/token.js'
// 请求菜单接口
import { getMenu } from '@/api/index.js'
export default {
  name: 'MyHome',
  props: {},
  data() {
    return {
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      // 被激活高亮的链接
      activePath: ''
    }
  },
  methods: {
    // 登出操作
    logout() {
      this.$router.replace('/login')
      removeToken()
    },
    // 菜单折叠切换
    toggleMenu() {
      this.isCollapse = !this.isCollapse
    },
    /* 保存当前点击板块的路径，以设置高亮 */
    saveActivPath(k) {
      sessionStorage.setItem('activePath', k)
      this.activePath = k
    }
  },
  async created() {
    const res = await getMenu()
    this.menuList = res.data.data
    this.activePath = sessionStorage.getItem('activePath')
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #303439;
  color: #333;
  padding-left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
    }
  }
}
.el-aside {
  background-color: #333744;
  color: #333;
  text-align: center;
  line-height: 200px;
  .el-menu {
    border: none;
    /deep/.el-submenu__title {
      padding: 0 80px;
    }
  }
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  line-height: 24px;
  font-size: 10px;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
