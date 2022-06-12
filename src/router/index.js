import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'

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
    component: Home
  }
]

const router = new VueRouter({
  routes
})

export default router
