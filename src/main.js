import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/base.less'
import './assets/fonts/iconfont.css'
import './api'
import treeTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false
Vue.component('tree-table', treeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
