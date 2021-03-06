import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import UserList from '@/views/user/UserList.vue'
import RightList from '@/views/Rights/RightList.vue'
import RolesList from '@/views/Rights/RolesList.vue'
import GoodsCate from '@/views/goods/GoodsCate.vue'
import GoodsParams from '@/views/goods/GoodsParams.vue'
import GoodsList from '@/views/goods/GoodsList.vue'
import AddGood from '@/views/goods/AddGood.vue'
import OrderList from '@/views/Order/Order.vue'
import ReportPanel from '@/views/Repoert/Report.vue'
// 获取token
import { getToken } from '@/utils/token.js'
Vue.use(VueRouter)

const routes = [
  // 重定向
  {
    path: '/',
    redirect: '/login'
  },
  // 登录页
  {
    path: '/login',
    component: Login
  },
  {
    // layout页面
    path: '/home',
    component: Home,
    children: [
      {
        path: '/users',
        component: UserList
      },
      {
        path: '/rights',
        component: RightList
      },
      {
        path: '/roles',
        component: RolesList
      },
      {
        path: '/categories',
        component: GoodsCate
      },
      {
        path: '/params',
        component: GoodsParams
      },
      {
        path: '/goods',
        component: GoodsList
      },
      {
        path: '/goods/add',
        component: AddGood
      },
      {
        path: '/orders',
        component: OrderList
      },
      {
        path: '/reports',
        component: ReportPanel
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') next()
  const tokenStr = getToken()
  if (!tokenStr && to.path !== '/login') return next('/login')
  next(true)
})

export default router
