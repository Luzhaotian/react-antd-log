import { memo } from 'react'
import { Card, Space, Typography } from 'antd'
import { FireOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons'
import type { ActionItem } from '@/types'

const { Text } = Typography

const actions: ActionItem[] = [
  {
    icon: <FireOutlined style={{ fontSize: 20, color: '#1890ff' }} />,
    title: '创建新热点',
    description: '快速添加新的热点信息',
    bgColor: '#f0f9ff',
    iconColor: '#1890ff',
  },
  {
    icon: <FileTextOutlined style={{ fontSize: 20, color: '#52c41a' }} />,
    title: '查看报告',
    description: '生成数据分析报告',
    bgColor: '#f6ffed',
    iconColor: '#52c41a',
  },
  {
    icon: <UserOutlined style={{ fontSize: 20, color: '#faad14' }} />,
    title: '用户管理',
    description: '管理系统用户和权限',
    bgColor: '#fff7e6',
    iconColor: '#faad14',
  },
]

function QuickActions() {
  return (
    <Card title="快速操作">
      <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
        {actions.map((action, index) => (
          <Card
            key={`action-${index}`}
            size="small"
            hoverable
            style={{ cursor: 'pointer', background: action.bgColor }}
          >
            <Space>
              {action.icon}
              <div>
                <div style={{ fontWeight: 500 }}>{action.title}</div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {action.description}
                </Text>
              </div>
            </Space>
          </Card>
        ))}
      </Space>
    </Card>
  )
}

// 使用 memo 优化，避免不必要的重渲染
export default memo(QuickActions)
