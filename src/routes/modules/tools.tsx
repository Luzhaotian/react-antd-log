import { lazy } from 'react'
import { ToolOutlined } from '@ant-design/icons'
import type { ExtendedRouteObject } from '@/types'

const CodeCompress = lazy(() => import('@/pages/Tools/CodeCompress'))
const JsonViewer = lazy(() => import('@/pages/Tools/JsonViewer'))
const FileRename = lazy(() => import('@/pages/Tools/FileRename'))
const QrCode = lazy(() => import('@/pages/Tools/QrCode'))

const toolsRoutes: ExtendedRouteObject[] = [
  {
    path: '/tools',
    icon: <ToolOutlined />,
    meta: {
      name: '工具包',
    },
    children: [
      {
        path: 'code-compress',
        element: <CodeCompress />,
        meta: {
          name: '代码压缩',
        },
      },
      {
        path: 'json-viewer',
        element: <JsonViewer />,
        meta: {
          name: 'JSON 查看器',
        },
      },
      {
        path: 'file-rename',
        element: <FileRename />,
        meta: {
          name: '文件重命名',
        },
      },
      {
        path: 'qr-code',
        element: <QrCode />,
        meta: {
          name: '二维码管理',
        },
      },
    ],
  },
]

export default toolsRoutes
