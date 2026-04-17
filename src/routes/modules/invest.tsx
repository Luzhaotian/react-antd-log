import { lazy } from 'react'
import { StockOutlined } from '@ant-design/icons'
import type { ExtendedRouteObject } from '@/types'

const FundMonitor = lazy(() => import('@/pages/Fund'))

const investRoutes: ExtendedRouteObject[] = [
  {
    path: '/invest',
    icon: <StockOutlined />,
    meta: {
      name: '投资理财',
    },
    children: [
      {
        path: 'fund',
        element: <FundMonitor />,
        meta: {
          name: '基金监控',
        },
      },
    ],
  },
]

export default investRoutes
