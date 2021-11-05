<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <el-aside :width="isCollapse? '64px': '200px'" >
        <!-- 侧边栏菜单区域 -->
        <div class="toggle-button" @click="collapseChange">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened 
          :collapse='isCollapse'
          :collapse-transition='false'
          router
          :default-active='navState'>
          <!-- 一级菜单 --> 
          <!-- index一样会导致打开一个全都打开,格式为字符串 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
              <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key='subItem.id' @click="savaNavState('/'+subItem.path)">
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
          </el-submenu>
        </el-menu>

  </el-aside>
    <!-- 右边内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  
</template>

<script>
export default {
  created(){
  // 页面一上来加载的时候就获取侧边栏列表数据
    this.getMenuList()
    this.navState = window.sessionStorage.getItem('navState')
  },
  data(){
    return {
      // 左侧菜单数据
      menuList:[],
      // 一级菜单图标动态显示
      iconsObj: {
        125:'iconfont icon-users',
        103:'iconfont icon-tijikongjian',
        101:'iconfont icon-shangpin',
        102:'iconfont icon-danju',
        145:'iconfont icon-baobiao',
      },
      // 折叠
      isCollapse:false,
      // 路由了之后，侧边栏就不高亮了
      navState:'',
    }
  },
  methods:{
    loginOut(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList(){
      const {data:res} =await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error('失败了')
      }
      this.menuList = res.data
      // this.$message.success('home成功了')
      // console.log(res.data);
    },
    // 点击按钮，切换菜单的折叠与展开
    collapseChange(){
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    savaNavState(state){
      window.sessionStorage.setItem('navState',state)
      this.navState = state
    }
  }
}
</script>

<style lang="less" scoped>
  
.home-container {
  background-color: pink;
  height: 100%;
}
.el-header {
  background-color: #373D41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color:#fff;
  font-size: 20px;
  padding-left: 0 !important;
  div {
    display: flex;
    align-items: center;
  }
  span {
    margin-left: 20px;
  }
  img {
    width: 199px;
    height: 60px;
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  color: #fff;
  text-align: center;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  // 字与字间隔
  letter-spacing: 0.2em;
}
</style>