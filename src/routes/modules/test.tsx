import { lazy } from 'react'
import { ExperimentOutlined } from '@ant-design/icons'
import type { ExtendedRouteObject } from '@/types'

const SignIn = lazy(() => import('@/pages/Test/SignIn'))
const Ecommerce = lazy(() => import('@/pages/Test/Ecommerce'))
const Checkout = lazy(() => import('@/pages/Test/Checkout'))
const Dashboard = lazy(() => import('@/pages/Test/Dashboard'))
const SocialFeed = lazy(() => import('@/pages/Test/SocialFeed'))

const testRoutes: ExtendedRouteObject[] = [
  {
    path: '/test',
    icon: <ExperimentOutlined />,
    meta: {
      name: '测试',
    },
    children: [
      {
        path: 'sign-in',
        element: <SignIn />,
        meta: {
          name: 'Sign In 设计稿',
        },
      },
      {
        path: 'ecommerce',
        element: <Ecommerce />,
        meta: {
          name: 'Ecommerce 设计稿',
        },
      },
      {
        path: 'checkout',
        element: <Checkout />,
        meta: {
          name: 'Checkout 设计稿',
        },
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
        meta: {
          name: 'Dashboard 设计稿',
        },
      },
      {
        path: 'social-feed',
        element: <SocialFeed />,
        meta: {
          name: 'Social feed 设计稿',
        },
      },
    ],
  },
]

export default testRoutes
