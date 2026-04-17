import { useState, useEffect, Suspense, useMemo, useCallback } from 'react'
import { Layout, Menu, theme, Spin, Avatar, Dropdown } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import type { MenuProps } from 'antd'
import Logo from '@/layout/components/Logo'
import Breadcrumb from '@/layout/components/Breadcrumb'
import TextButton from '@/components/TextButton'
import { menuItems, getSelectedKeys, getOpenKeys } from '@/layout/config/menu'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { clearAuthSession } from '@/utils'

const { Header, Sider, Content } = Layout

function MainLayout() {
  // 自动更新浏览器标题
  useDocumentTitle()

  const [collapsed, setCollapsed] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['/'])
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const navigate = useNavigate()
  const location = useLocation()
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  // 根据路由更新选中的菜单项 - 使用 useMemo 优化
  const menuState = useMemo(() => {
    const keys = getSelectedKeys(location.pathname)
    const opens = getOpenKeys(location.pathname)
    return { keys, opens }
  }, [location.pathname])

  useEffect(() => {
    setSelectedKeys(menuState.keys)
    setOpenKeys(menuState.opens)
  }, [menuState])

  // 菜单点击处理 - 使用 useCallback 优化，启用 View Transitions
  const handleMenuClick = useCallback(
    ({ key }: { key: string }) => {
      navigate(key, { viewTransition: true })
    },
    [navigate]
  )

  // 菜单展开/收起处理 - 使用 useCallback 优化
  const handleOpenChange = useCallback((keys: string[]) => {
    setOpenKeys(keys)
  }, [])

  // 切换折叠状态 - 使用 useCallback 优化
  const toggleCollapsed = useCallback(() => {
    setCollapsed(prev => !prev)
  }, [])

  const handleUserMenuClick = useCallback<NonNullable<MenuProps['onClick']>>(
    ({ key }) => {
      if (key === 'logout') {
        clearAuthSession()
        navigate('/login', { replace: true })
      }
    },
    [navigate]
  )

  const userMenuItems = useMemo<MenuProps['items']>(
    () => [
      {
        key: 'logout',
        label: '退出登录',
      },
    ],
    []
  )

  return (
    <Layout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} width={200}>
        <Logo collapsed={collapsed} />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          items={menuItems}
          onClick={handleMenuClick}
          onOpenChange={handleOpenChange}
        />
      </Sider>
      <Layout>
        <Header
          className="flex items-center gap-4 px-6 h-16"
          style={{ background: colorBgContainer }}
        >
          <TextButton
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            className="text-base w-16 flex-center"
          />
          <Breadcrumb />
          <div className="ml-auto">
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} trigger={['click']}>
              <button type="button" className="flex-center gap-2 cursor-pointer border-none bg-transparent">
                <Avatar size={32} icon={<UserOutlined />} />
              </button>
            </Dropdown>
          </div>
        </Header>
        <Content
          className="my-6 mx-4 p-6 min-h-[280px]"
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Suspense
            fallback={
              <div className="flex-center min-h-[400px]">
                <Spin size="large" />
              </div>
            }
          >
            <div style={{ viewTransitionName: 'page-content' }}>
              <Outlet />
            </div>
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
