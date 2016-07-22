/* global __DEV__ */
if (__DEV__) {
  window.VueDev = Vue;
}
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import routerMap from './routes';
import App from './components/app';
import store from './vuex/store';
import { sync } from 'vuex-router-sync';
import Action from './vuex/actions';
import Filters from './filter';
import modules from './modules';  // 常用组件加载
import 'form-serializer';
import 'weui.js';

modules.forEach((component) => {
  Vue.component(component.name, component.module);
});
// import VuxPlugin from 'vux-plugin';

import VueFilter from 'vue-filter';
// register filters 自定义过滤器
window.Vue = Vue;

Object.keys(Filters).forEach((k) => {
  Vue.filter(k, Filters[k]);
});
Vue.use(VueFilter);
// console.log(VuxPlugin);
// Vue.use(VuxPlugin);

// Vue.use(VueValidator);
// addRulesOfValidator(Vue);
Vue.use(VueRouter);
Vue.use(VueResource);

const router = new VueRouter({
  hashbang: true,
  history: false,
  abstract: false,
  saveScrollPosition: true,
  transitionOnLoad: false,
  linkActiveClass: 'active',  // 链接活跃时附带的class
});
sync(store, router);
routerMap(router);

// 请求失败
Vue.http.interceptors.push((request, next) => {
  next((response) => {
    if (response.status === 0) {
      router.go({ name: 'timeout' });
    }
  });
});

router.afterEach(() => {
  Action.Tabbar.hide();
});
router.start(App, 'app');

export default Vue;
