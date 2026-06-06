import { lazy } from 'react'
import { AppstoreOutlined } from '@ant-design/icons'
import type { ExtendedRouteObject } from '@/types'

const CarLoanCalculatorList = lazy(() => import('@/pages/UserRequirement/CarLoanCalculatorList'))
const MortgageCalculatorList = lazy(() => import('@/pages/UserRequirement/MortgageCalculatorList'))
const LoanTracker = lazy(() => import('@/pages/UserRequirement/LoanTracker'))

const userRequirementRoutes: ExtendedRouteObject[] = [
  {
    path: '/user-requirement',
    icon: <AppstoreOutlined />,
    meta: {
      name: '用户需求',
    },
    children: [
      {
        path: 'car-loan-calculator',
        element: <CarLoanCalculatorList />,
        meta: {
          name: '车贷计算器列表',
        },
      },
      {
        path: 'mortgage-calculator',
        element: <MortgageCalculatorList />,
        meta: {
          name: '房贷计算器列表',
        },
      },
      {
        path: 'loan-tracker',
        element: <LoanTracker />,
        meta: {
          name: '房贷还款追踪',
          hideInMenu: true,
        },
      },
      {
        index: true,
        element: <MortgageCalculatorList />,
      },
    ],
  },
]

export default userRequirementRoutes
