// 用来使用es6中的api 如promise
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import fastclick from 'fastclick'
import router from './router'
import store from './store'
import VueLazyLoad from 'vue-lazyload'

// Vue.config.productionTip = false
import 'common/stylus/index.styl'
fastclick.attach(document.body)
/* eslint-disable no-new */
Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
})
new Vue({
  el: '#index',
  router,
  store,
  render: h => h(App)
})