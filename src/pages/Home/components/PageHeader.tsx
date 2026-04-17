import { memo } from 'react'
import { Typography } from 'antd'
import type { PageHeaderProps } from '@/types'
const { Title, Text } = Typography

function PageHeader({
  title = '数据概览',
  subtitle = '实时监控系统运行状态和热点数据',
}: PageHeaderProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      <Title level={2} style={{ marginBottom: 8 }}>
        {title}
      </Title>
      <Text type="secondary">{subtitle}</Text>
    </div>
  )
}

// 使用 memo 优化，避免不必要的重渲染
export default memo(PageHeader)
