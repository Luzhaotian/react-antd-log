import type { ButtonProps } from 'antd'

/** 文本按钮组件属性 */
export interface TextButtonProps extends Omit<ButtonProps, 'type'> {
  /** 按钮 className */
  className?: string
}
