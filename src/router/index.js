import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  {path:'/', redirect:'/login'},
  {path:'/login', component:Login},
  {path:'/home', component:Home},
]

const router = new VueRouter({
  routes
})
// 如果用户通过url地址直接访问，则强制跳转到登录页面
router.beforeEach((to,from,next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
