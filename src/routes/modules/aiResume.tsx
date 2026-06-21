import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { FileTextOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons'
import type { ExtendedRouteObject } from '@/types'

const Templates = lazy(() => import('@/pages/AiResume/TemplateList'))
const MyResumes = lazy(() => import('@/pages/AiResume'))

const aiResumeRoutes: ExtendedRouteObject[] = [
  {
    path: '/ai-resume',
    icon: <FileTextOutlined />,
    meta: {
      name: 'AI 简历',
    },
    children: [
      {
        index: true,
        element: <Navigate to="templates" replace />,
        meta: { name: '', hideInMenu: true },
      },
      {
        path: 'templates',
        element: <Templates />,
        icon: <AppstoreOutlined />,
        meta: {
          name: '模板列表',
        },
      },
      {
        path: 'my-resumes',
        element: <MyResumes />,
        icon: <UnorderedListOutlined />,
        meta: {
          name: '我的简历',
        },
      },
    ],
  },
]

export default aiResumeRoutes
