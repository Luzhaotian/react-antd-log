import { memo } from 'react'
import { Card, Space, Typography, Progress } from 'antd'
import type { SystemPerformanceProps } from '@/types'

const { Text } = Typography

function SystemPerformance({ data }: SystemPerformanceProps) {
  return (
    <Card title="系统性能" style={{ height: '100%' }}>
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        {data.map(item => (
          <div key={item.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text>{item.label}</Text>
              <Text strong>{item.value}%</Text>
            </div>
            <Progress percent={item.value} strokeColor={item.color} />
          </div>
        ))}
      </Space>
    </Card>
  )
}

// 使用 memo 优化，避免不必要的重渲染
export default memo(SystemPerformance)
