import { Breadcrumb as AntdBreadcrumb } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { HomeOutlined } from '@ant-design/icons'
import { routes } from '@/routes'
import { findRoutePath } from '@/utils'

function Breadcrumb() {
  const location = useLocation()
  const navigate = useNavigate()

  // 生成面包屑数据
  const breadcrumbItems = (() => {
    const items: Array<{ title: React.ReactNode; path?: string }> = []

    // 首页
    items.push({
      title: (
        <span className="flex items-center gap-1">
          <HomeOutlined />
          <span>首页</span>
        </span>
      ),
      path: '/',
    })

    // 如果是首页，只显示首页
    if (location.pathname === '/') {
      return items
    }

    // 查找路由路径
    const routePath = findRoutePath(routes, location.pathname)

    if (routePath && routePath.length > 0) {
      routePath.forEach((item, index) => {
        // 跳过首页（已经在上面添加了）
        if (item.path === '/') {
          return
        }

        const isLast = index === routePath.length - 1
        items.push({
          title: item.name,
          path: index === 0 ? undefined : isLast ? undefined : item.path,
        })
      })
    }

    return items
  })()

  return (
    <AntdBreadcrumb
      items={breadcrumbItems.map(item => ({
        title: item.path ? (
          <a
            onClick={e => {
              e.preventDefault()
              if (item.path) {
                navigate(item.path)
              }
            }}
            className="cursor-pointer hover:text-blue-500"
          >
            {item.title}
          </a>
        ) : (
          <span>{item.title}</span>
        ),
      }))}
    />
  )
}

export default Breadcrumb
