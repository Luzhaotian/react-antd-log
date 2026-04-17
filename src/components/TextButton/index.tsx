import { Button } from 'antd'
import { forwardRef } from 'react'
import type { TextButtonProps } from '@/types'

/**
 * TextButton 组件
 * 二次封装 Antd Button，统一管理 type="text" 的按钮
 */
const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>(
  ({ className = '', ...props }, ref) => {
    return <Button ref={ref} type="text" className={className} {...props} />
  }
)

TextButton.displayName = 'TextButton'

export default TextButton
