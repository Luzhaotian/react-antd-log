import { lazy } from 'react'
import { FileTextOutlined } from '@ant-design/icons'
import type { ExtendedRouteObject } from '@/types'

const TemplateCenter = lazy(() => import('@/pages/ResumeEditor/TemplateCenter'))
const ResumeList = lazy(() => import('@/pages/ResumeEditor/ResumeList'))
const Workbench = lazy(() => import('@/pages/ResumeEditor/Workbench'))

const resumeEditorRoutes: ExtendedRouteObject[] = [
  {
    path: '/resume-editor',
    icon: <FileTextOutlined />,
    meta: {
      name: '简历编辑器',
    },
    children: [
      {
        path: 'templates',
        element: <TemplateCenter />,
        meta: {
          name: '模板中心',
        },
      },
      {
        path: 'list',
        element: <ResumeList />,
        meta: {
          name: '我的简历',
        },
      },
      {
        path: 'workbench/:id',
        element: <Workbench />,
        meta: {
          name: '编辑简历',
          hideInMenu: true,
        },
      },
    ],
  },
]

export default resumeEditorRoutes
