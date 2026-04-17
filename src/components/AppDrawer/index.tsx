import { Drawer } from 'antd'
import type { DrawerProps } from 'antd'

/**
 * 基于 antd Drawer 的二次封装，统一项目内抽屉用法。
 * 透传所有 DrawerProps，便于后续统一样式或行为。
 */
function AppDrawer(props: DrawerProps) {
  return <Drawer {...props} />
}

export default AppDrawer
