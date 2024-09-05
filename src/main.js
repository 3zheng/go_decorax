import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import '@/style/global.css'
import enLocale from 'element-ui/lib/locale/lang/en' 
import esLocale from 'element-ui/lib/locale/lang/es' 
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import locale from 'element-ui/lib/locale'
//import ECharts from 'echarts'
import Vuex from 'vuex' 

//选择系统语言
const browserLanguage = navigator.language || navigator.userLanguage
let lang

if (browserLanguage.startsWith('zh')) {
  lang = zhLocale
} else if (browserLanguage.startsWith('es')) {
  lang = esLocale
} else {
  lang = enLocale
}

Vue.config.productionTip = false;
Vue.use(ElementUI, {locale:lang});
locale.use(lang)
Vue.prototype.axios = axios;
Vue.use(Vuex)

router.beforeEach((to,from,next)=>{
  let isLogin = sessionStorage.getItem('isLogin')
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

