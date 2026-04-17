import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import dayjs from 'dayjs'
import { APP_NAME } from '@/constants'
import 'dayjs/locale/zh-cn'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import 'antd/dist/reset.css'
import 'virtual:uno.css'
import './index.css'
import MainLayout from '@/layout/MainLayout'
import RequireAuth from '@/components/RequireAuth'
import Login from '@/pages/Login'
import { routes } from '@/routes'

// 中国时区 + 中文：Ant Design 日期/日历的星期、月份由 dayjs locale 决定
dayjs.locale('zh-cn')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Shanghai')

// 首屏标题由统一配置设置（路由切换后由 useDocumentTitle 覆盖）
document.title = APP_NAME

// 创建 data router，支持 useBlocker 等新特性
const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    children: routes,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider 
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#ff4d4f', // 红色主题色
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  </StrictMode>,
)
