import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import * as routers from './router'
import store from './vuex/store';
import $ from 'jquery'
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';

Vue.use(VueRouter)
Vue.use(Mint);

const router = new VueRouter({
  routes:routers.routes
})
router.beforeEach((to, from, next) => {
  store.dispatch("updateFooter",true);
  store.dispatch("updateBackClass",'ddbg');
  next()
})
new Vue({
  render: h => h(App),
  router
}).$mount('#app')

window.$=$
