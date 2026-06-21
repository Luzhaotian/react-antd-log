import { lazy } from 'react'
import { FileTextOutlined } from '@ant-design/icons'
import type { ExtendedRouteObject } from '@/types'

const AiResume = lazy(() => import('@/pages/AiResume'))

const aiResumeRoutes: ExtendedRouteObject[] = [
  {
    path: '/ai-resume',
    icon: <FileTextOutlined />,
    meta: {
      name: 'AI 简历',
    },
    children: [
      {
        path: 'generator',
        element: <AiResume />,
        meta: {
          name: '简历生成器',
        },
      },
    ],
  },
]

export default aiResumeRoutes
