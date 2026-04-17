import { lazy } from 'react'
import { SettingOutlined } from '@ant-design/icons'
import type { ExtendedRouteObject } from '@/types'

const Settings = lazy(() => import('@/pages/Settings/index'))
const SettingsBasic = lazy(() => import('@/pages/Settings/Basic'))
const SettingsAdvanced = lazy(() => import('@/pages/Settings/Advanced'))

const settingsRoutes: ExtendedRouteObject[] = [
  {
    path: '/settings',
    icon: <SettingOutlined />,
    meta: {
      name: '设置',
    },
    children: [
      {
        path: 'index',
        element: <Settings />,
        meta: {
          name: '设置首页',
        },
      },
      {
        path: 'basic',
        element: <SettingsBasic />,
        meta: {
          name: '基础设置',
        },
      },
      {
        path: 'advanced',
        element: <SettingsAdvanced />,
        meta: {
          name: '高级设置',
        },
      },
    ],
  },
]

export default settingsRoutes
