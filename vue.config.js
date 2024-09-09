const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 31111, // 配置端口号
    proxy: {
      '/api': {
        //target: 'http://104.225.234.236:31111', // 替换为你的API基础地址
        //target: 'http://34.176.136.161:31111', // 替换为你的API基础地址
        target: 'http://localhost:24686', // 替换为你的API基础地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }    
  }
})

