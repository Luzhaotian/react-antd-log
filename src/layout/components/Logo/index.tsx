import { memo } from 'react'
import { Typography } from 'antd'
import { APP_NAME, LOGO_SRC } from '@/constants'
import type { LogoProps } from '@/types'

const { Text } = Typography

/**
 * Logo：与浏览器标签页图标共用 public/favicon.svg
 * 展开/收起时用 max-width + opacity 做过渡，避免文字瞬间消失
 */
const Logo = memo(function Logo({ collapsed = false }: LogoProps) {
  return (
    <div
      className={`flex-center h-16 px-4 overflow-hidden transition-[gap] duration-300 ease-in-out ${collapsed ? 'gap-0' : 'gap-3'}`}
    >
      <div className="flex-center flex-shrink-0">
        <img src={LOGO_SRC} alt="" width={32} height={32} className="block" aria-hidden />
      </div>
      <div
        className="min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-in-out"
        style={{
          maxWidth: collapsed ? 0 : 96,
          opacity: collapsed ? 0 : 1,
        }}
      >
        <Text className="text-lg text-white" strong>
          {APP_NAME}
        </Text>
      </div>
    </div>
  )
})

export default Logo
