/** 页面离开确认组件属性 */
export interface PageLeaveGuardProps {
  /** 是否启用离开提示 */
  when: boolean
  /** 提示消息 */
  message?: string
  /** 确认框标题（仅路由切换时显示） */
  title?: string
}
