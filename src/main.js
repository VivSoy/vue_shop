import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
/* 导入全局样式 */
import '@/assets/css/global.css'
/* 引入图标 */
import '@/assets/fonts/iconfont.css'

// 全局树形table插件
import TableTree from 'vue-table-with-tree-grid'

Vue.config.productionTip = false

Vue.component('tree-table', TableTree)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
