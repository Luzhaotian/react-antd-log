import { lazy } from 'react'
import { HomeOutlined } from '@ant-design/icons'
import type { ExtendedRouteObject } from '@/types'

const Home = lazy(() => import('@/pages/Home'))

const homeRoutes: ExtendedRouteObject[] = [
  {
    index: true,
    path: '/',
    element: <Home />,
    icon: <HomeOutlined />,
    meta: {
      name: '首页',
    },
  },
]

export default homeRoutes
