<template>
  <div>
    <el-container class="">
      <el-header class="homeHeader">
        <div class="title">
          云E办后台系统
        </div>
        <el-dropdown class="userInfo" @command="commandHandler">
          <span class="el-dropdown-link">
            {{ user ? user.name : 'loading' }}<i><img :src="user? user.userFace: ''"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
            <el-dropdown-item command="setting">设置</el-dropdown-item>
            <el-dropdown-item command="logout">注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!--      <el-menu @select="menuClick">-->
          <!--加上router属性，启用路由模式，就会以el-menu-item的index属性值作为路径，将el-menu-item作为router-link，进行路由跳转-->
          <el-menu router unique-opened><!--unique-opened意思是打开时只打开这一个-->
            <!--循环路由，根据路由创建导航-->      <!--$router.options就是@/router/index.js中的配置对象-->
            <template v-for="(item, index) in routes">
              <!--给每个子菜单配置index以区分-->
              <el-submenu
                  :index="index + ''"
                  v-if="!item.hidden"
                  :key="index">
                <template slot="title">
                  <i :class="item.iconCls" style="color: #1accff; margin-right: 5px"></i>
                  <span>{{ item.name }}</span>
                </template>
                <el-menu-item v-for="(child, idx) in item.children"
                              :index="child.path"
                              :key="idx">{{ child.name }}
                </el-menu-item>
              </el-submenu>
            </template>

          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path !== '/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="homeWelcome" v-if="this.$router.currentRoute.path === '/home'">
            欢迎来到云E办系统
          </div>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    /*/!*这个index就是被点击的menu-item的index属性值*!/
    menuClick(index) {
      /!*如果不配置路由children，
        默认跳转到App.vue的router-view中去了*!/
      this.$router.push(index)
    }*/
    commandHandler(command) {
      if (command === 'logout') {
        this.$confirm('此操作将注销, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.postRequest('/logout')
          //退出登录后要删除sessionStorage中的tokenStr和user
          window.sessionStorage.removeItem('tokenStr')
          window.sessionStorage.removeItem('user')
          //storage和vuex中的数据要惦记着，该修改就修改
          this.$store.commit('initRoutes', [])
          this.$router.replace('/')
          //后端有传过来信息，前端拦截器中会展示的
          /*this.$message({
            type: 'success',
            message: '注销成功!'
          });*/
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    },
  },
  data() {
    return {
      user: JSON.parse(window.sessionStorage.getItem('user'))
    }
  },
  computed: {
    routes() {
      return this.$store.state.routes;
    }
  }
}
</script>

<style scoped>
.homeHeader {
  background: #409eff;
  display: flex; /*弹性布局*/
  align-items: center;
  justify-content: space-between; /*去除空白、还要在index.html中设置一下*/
  padding: 0 15px;
  box-sizing: border-box;
}

.homeHeader .title {
  font-size: 30px;
  font-family: 华文楷体;
  color: white;
}

.homeHeader .userInfo {
  cursor: pointer;
}

.el-dropdown-link img {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-left: 8px;
}

.homeWelcome {
  text-align: center;
  font-size: 30px;
  font-family: 华文楷体;
  color: #409eff;
  padding-top: 50px;
}
</style>