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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 仅按 node_modules 包名拆分；避免匹配到仓库路径 react-antd-log
          const nm = id.split('node_modules/')[1] || id.split('node_modules\\')[1]
          if (!nm) return
          const pkg = nm.startsWith('@')
            ? nm.split('/').slice(0, 2).join('/')
            : nm.split('/')[0]
          if (pkg === 'antd' || pkg.startsWith('@ant-design/')) return 'antd'
          if (pkg === 'echarts' || pkg === 'echarts-for-react' || pkg.startsWith('echarts-'))
            return 'echarts'
          if (
            pkg === 'xlsx' ||
            pkg === 'jspdf' ||
            pkg === 'jspdf-autotable' ||
            pkg === 'jspdf-font' ||
            pkg === 'pdfjs-dist' ||
            pkg === 'react-pdf' ||
            pkg === 'docx-preview' ||
            pkg === 'mammoth'
          ) {
            return 'docs'
          }
          if (pkg === 'react' || pkg === 'react-dom' || pkg === 'react-router' || pkg === 'react-router-dom') {
            return 'react-vendor'
          }
        },
      },
    },
  },
  server: {
    open: false,
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      '/fundapi': {
        target: 'https://fundmobapi.eastmoney.com',
        changeOrigin: true,
        rewrite: p => p.replace(/^\/fundapi/, ''),
        secure: false,
      },
      '/fundgz': {
        target: 'https://fundgz.1234567.com.cn',
        changeOrigin: true,
        rewrite: p => p.replace(/^\/fundgz/, ''),
        secure: false,
      },
      '/fundsuggest': {
        target: 'https://fundsuggest.eastmoney.com',
        changeOrigin: true,
        rewrite: p => p.replace(/^\/fundsuggest/, ''),
        secure: false,
      },
      '/funddata': {
        target: 'https://fund.eastmoney.com',
        changeOrigin: true,
        rewrite: p => p.replace(/^\/funddata/, ''),
        secure: false,
      },
      '/datacenter': {
        target: 'https://datacenter-web.eastmoney.com',
        changeOrigin: true,
        rewrite: p => p.replace(/^\/datacenter/, ''),
        secure: false,
      },
    },
  },
})
