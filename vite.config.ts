import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import path from 'path'

// https://vite.dev/config/
// 部署到 GitHub Pages 子路径时由 CI 注入 VITE_BASE_PATH，例如 /react-antd-log/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), UnoCSS()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    open: false, // 在系统默认浏览器中打开
    host: '0.0.0.0', // 允许外部访问
    port: 5173, // 指定端口
    proxy: {
      // 本地 Java 后端（同级 react-antd-log-api，默认 8080）
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      // 代理东方财富基金 API，解决跨域问题
      '/fundapi': {
        target: 'https://fundmobapi.eastmoney.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/fundapi/, ''),
        secure: false,
      },
      // 代理天天基金实时估值 API
      '/fundgz': {
        target: 'https://fundgz.1234567.com.cn',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/fundgz/, ''),
        secure: false,
      },
      // 代理基金搜索联想 API
      '/fundsuggest': {
        target: 'https://fundsuggest.eastmoney.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/fundsuggest/, ''),
        secure: false,
      },
      // 代理基金详情数据 API（包含分时估值走势）
      '/funddata': {
        target: 'https://fund.eastmoney.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/funddata/, ''),
        secure: false,
      },
      '/datacenter': {
        target: 'https://datacenter-web.eastmoney.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/datacenter/, ''),
        secure: false,
      },
    },
  },
})
