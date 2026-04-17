import { lazy } from 'react'
import type { ExtendedRouteObject } from '@/types'

const NotFound = lazy(() => import('@/pages/NotFound'))

const errorRoutes: ExtendedRouteObject[] = [
  {
    path: '*',
    element: <NotFound />,
    meta: {
      name: '页面未找到',
      hideInMenu: true,
    },
  },
]

export default errorRoutes
