import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";
import router from "@/router";
import store from "@/store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.css'
import {deleteRequest, getRequest, postRequest, putRequest} from "@/utils/api";
import {initMenu} from "@/utils/menus";

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(ElementUI);

//请求比较常用，使用插件的方式放到vue.prototype中
Vue.prototype.postRequest = postRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.getRequest = getRequest
Vue.prototype.deleteRequest = deleteRequest
//在每次路由跳转前，加载菜单
router.beforeEach((to, from, next) => {
    if (window.sessionStorage.getItem('tokenStr')) {
        initMenu(router, store);
        //判断用户信息是否已经存在
        if (!window.sessionStorage.getItem('user')) {
            getRequest('/admin/info').then(resp => {
                if (resp) {
                    //存放用户信息
                    window.sessionStorage.setItem('user', JSON.stringify(resp));
                    //路由刷新页面，更新用户数据
                    router.go(0)
                }
            })
        }
        next()
    } else {
        //处理直接在地址栏上输入地址进行路由跳转的问题（未登录）
        if (to.path === '/') {
            next();
        } else {
            //如果不是去登录页，就先让他登录，再去redirect
            //使用query参数
            next('/?redirect=' + to.path)
        }
    }
})

new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app')
