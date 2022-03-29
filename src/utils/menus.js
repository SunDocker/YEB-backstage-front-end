import {getRequest} from "@/utils/api";
/*要求传过来的是vm.router*/
export const initMenu = (router, store) => {
    if (store.state.routes.length > 0) {
        return
    }
    getRequest('/system/cfg/menu').then(data => {
        if (data) {
            //格式化后端发来的routers
            let fmtRoutes = formatRoutes(data)
            //添加到路由中（这是vue-router中的方法）
            router.addRoutes(fmtRoutes)
            //存储到vuex中
            store.commit('initRoutes', fmtRoutes)
        }
    })
}

export const formatRoutes = routes => {
    let fmtRoutes = []
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            iconCls,
            children
        } = router
        if (children && children instanceof Array) {
            //递归生成子路由
            children = formatRoutes(children)
        }
        let fmRouter = {
            path,
            name,
            iconCls,
            children,
            component(resolve) {
                if (component === 'Home') {
                    require(['@/views/Home.vue'], resolve)
                } else {
                    let prefix = component.substring(0, 3).toLowerCase();
                    require(['../views/' + prefix + '/' + component + '.vue'], resolve)
                }
            }
        }
        fmtRoutes.push(fmRouter)
    })
    return fmtRoutes
}