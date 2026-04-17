import { lazy } from 'react'
import { UserOutlined } from '@ant-design/icons'
import type { ExtendedRouteObject } from '@/types'

const UserList = lazy(() => import('@/pages/User/List'))
const UserDetail = lazy(() => import('@/pages/User/Detail'))

const userRoutes: ExtendedRouteObject[] = [
  {
    path: '/user',
    icon: <UserOutlined />,
    meta: {
      name: '用户管理',
    },
    children: [
      {
        path: 'list',
        element: <UserList />,
        meta: {
          name: '用户列表',
        },
      },
      {
        path: 'detail/:id?',
        element: <UserDetail />,
        meta: {
          name: '用户详情',
          hideInMenu: true,
        },
      },
    ],
  },
]

export default userRoutes
