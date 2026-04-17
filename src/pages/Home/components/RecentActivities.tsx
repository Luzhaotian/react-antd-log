import { memo } from 'react'
import { Card, Space, Typography, Tag } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import type { RecentActivitiesProps } from '@/types'
import { TAG_ATTRIBUTE } from '@/constants'

const { Text } = Typography

function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <Card
      title={
        <Space>
          <ClockCircleOutlined />
          <span>最近活动</span>
        </Space>
      }
    >
      <div>
        {activities.map(item => (
          <div
            key={item.id}
            style={{
              padding: '12px 0',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            <div style={{ marginBottom: 8 }}>
              <Space>
                <Text strong>{item.title}</Text>
                <Tag color={TAG_ATTRIBUTE[item?.status].color}>
                  {TAG_ATTRIBUTE[item?.status].text}
                </Tag>
              </Space>
            </div>
            <div>
              <Space>
                <Tag>{item.category}</Tag>
                <Text type="secondary">{item.time}</Text>
              </Space>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// 使用 memo 优化，避免不必要的重渲染
export default memo(RecentActivities)
