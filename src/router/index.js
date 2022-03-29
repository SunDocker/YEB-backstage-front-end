//import Vue from "vue";
import VueRouter from 'vue-router'
import Login from "@/views/Login";
import Home from "@/views/Home";
import Test1 from "@/views/Test1";
import Test2 from "@/views/Test2";
//Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        {
            path: '/',
            name: 'Login',
            component: Login,
            hidden: true
        },
        {
            path: '/home',
            name: '导航1',
            component: Home,
            /*如果不配置成子路由，会直接用App.vue中的router-view呈现跳转后的内容*/
            /*但是最好不要把路由都写死在这个文件中，要从后端动态获取，然后通过vuex修改*/
            children: [
                {
                    path: '/test1',
                    name: '选项1',
                    component: Test1
                },
                {
                    path: '/test2',
                    name: '选项2',
                    component: Test2
                }

            ]
        },
    ]
})