import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/base.less'
import './assets/fonts/iconfont.css'
import './api'
import treeTable from 'vue-table-with-tree-grid'
import moment from 'moment'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

Vue.filter('dateFormat',function(time) {
  return moment(time).format('YYYY-MM-DD HH:mm:ss')
})

Vue.config.productionTip = false
Vue.component('tree-table', treeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
