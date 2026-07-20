import { Navigate } from 'react-router-dom'
import type { ExtendedRouteObject } from '@/types'

/**
 * AI 简历入口已收敛到简历编辑器，保留路径重定向以兼容旧书签
 */
const aiResumeRoutes: ExtendedRouteObject[] = [
  {
    path: '/ai-resume',
    meta: {
      name: 'AI 简历',
      hideInMenu: true,
    },
    children: [
      {
        index: true,
        element: <Navigate to="/resume-editor/templates" replace />,
        meta: { name: '', hideInMenu: true },
      },
      {
        path: 'templates',
        element: <Navigate to="/resume-editor/templates" replace />,
        meta: { name: '模板列表', hideInMenu: true },
      },
      {
        path: 'my-resumes',
        element: <Navigate to="/resume-editor/list" replace />,
        meta: { name: '我的简历', hideInMenu: true },
      },
      {
        path: '*',
        element: <Navigate to="/resume-editor/templates" replace />,
        meta: { name: '', hideInMenu: true },
      },
    ],
  },
]

export default aiResumeRoutes
