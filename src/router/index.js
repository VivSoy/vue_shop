import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import UserList from '@/views/user/UserList.vue'

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
