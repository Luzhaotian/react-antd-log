import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import path from 'path'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(path.resolve(__dirname, './package.json'), 'utf-8')) as {
  version: string
}

// https://vite.dev/config/
// 部署到 GitHub Pages 子路径时由 CI 注入 VITE_BASE_PATH，例如 /react-antd-log/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  define: {
    __APP_VERSION__: JSON.stringify(process.env.VITE_APP_VERSION || pkg.version),
  },
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
          const pkgName = nm.startsWith('@')
            ? nm.split('/').slice(0, 2).join('/')
            : nm.split('/')[0]
          if (pkgName === 'antd' || pkgName.startsWith('@ant-design/')) return 'antd'
          if (
            pkgName === 'echarts' ||
            pkgName === 'echarts-for-react' ||
            pkgName.startsWith('echarts-')
          ) {
            return 'echarts'
          }
          if (
            pkgName === 'xlsx' ||
            pkgName === 'jspdf' ||
            pkgName === 'jspdf-autotable' ||
            pkgName === 'jspdf-font' ||
            pkgName === 'pdfjs-dist' ||
            pkgName === 'react-pdf' ||
            pkgName === 'docx-preview' ||
            pkgName === 'mammoth'
          ) {
            return 'docs'
          }
          if (
            pkgName === 'react' ||
            pkgName === 'react-dom' ||
            pkgName === 'react-router' ||
            pkgName === 'react-router-dom'
          ) {
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
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/test/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
  },
})
