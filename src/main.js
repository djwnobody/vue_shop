import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
// 导入全局css
import "./assets/css/global.css";
// 引入字体
import "./assets/fonts/iconfont.css";
Vue.config.productionTip = false;
// 引入axios
import axios from "axios";
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
// 每次发送请求前，都要携带请求头，服务器才返回数据
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});
Vue.prototype.$http = axios;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
