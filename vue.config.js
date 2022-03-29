module.exports = {
    devServer: {
        host: 'localhost',
        port:8080,
        proxy: {
            '/': {
                target: 'http://localhost:8081',
                pathRewrite:{'^/':'/'},
                ws: true,//用于支持websocked
                changeOrigin: true//是否伪装成和后端服务器端口号相同，控制请求头中的host值
            },
        }
    }
}