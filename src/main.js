import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
// 导入全局css
import "./assets/css/global.css";
// 引入字体
import "./assets/fonts/iconfont.css";
import TreeTable from "vue-table-with-tree-grid";
Vue.config.productionTip = false;
// 引入axios
import axios from "axios";

// 导入富文本编辑器
import VueQuillEditor from "vue-quill-editor";
// 导入富文本编辑器对应的样式
import "quill/dist/quill.core.css"; // import styles
import "quill/dist/quill.snow.css"; // for snow theme
import "quill/dist/quill.bubble.css"; // for bubble theme

// 配置请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
// 每次发送请求前，都要携带请求头，服务器才返回数据
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});
Vue.prototype.$http = axios;

Vue.filter("dataFormat", function (originVal) {
  const dt = new Date(originVal);

  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + "").padStart(2, "0");
  const d = (dt.getDate() + "").padStart(2, "0");

  const hh = (dt.getHours() + "").padStart(2, "0");
  const mm = (dt.getMinutes() + "").padStart(2, "0");
  const ss = (dt.getSeconds() + "").padStart(2, "0");

  // 格式为 YYYY-MM-DD-hh-mm-ss
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});
Vue.component("tree-table", TreeTable);
// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
