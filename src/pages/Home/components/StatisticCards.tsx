import { useState, useCallback, memo } from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  FileTextOutlined,
  FireOutlined,
  ThunderboltOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import type { StatisticCardData } from '@/types'

const statisticData: StatisticCardData[] = [
  {
    title: '总热点数',
    value: 1234,
    prefix: <FireOutlined />,
    suffix: (
      <span style={{ fontSize: 14, color: '#52c41a' }}>
        <ArrowUpOutlined /> 12%
      </span>
    ),
    contentColor: '#cf1322',
    iconBgColor: 'rgba(207, 19, 34, 0.1)',
    iconColor: '#cf1322',
    hoverColor: '#ff4d4f',
    onClick: () => {
      console.log('查看总热点数详情')
      // 可以在这里添加路由跳转或弹窗逻辑
    },
  },
  {
    title: '今日新增',
    value: 89,
    prefix: <ThunderboltOutlined />,
    suffix: (
      <span style={{ fontSize: 14, color: '#52c41a' }}>
        <ArrowUpOutlined /> 8%
      </span>
    ),
    contentColor: '#1890ff',
    iconBgColor: 'rgba(24, 144, 255, 0.1)',
    iconColor: '#1890ff',
    hoverColor: '#40a9ff',
    onClick: () => {
      console.log('查看今日新增详情')
    },
  },
  {
    title: '活跃用户',
    value: 567,
    prefix: <UserOutlined />,
    suffix: (
      <span style={{ fontSize: 14, color: '#f5222d' }}>
        <ArrowDownOutlined /> 3%
      </span>
    ),
    contentColor: '#722ed1',
    iconBgColor: 'rgba(114, 46, 209, 0.1)',
    iconColor: '#722ed1',
    hoverColor: '#9254de',
    onClick: () => {
      console.log('查看活跃用户详情')
    },
  },
  {
    title: '处理中',
    value: 45,
    prefix: <FileTextOutlined />,
    contentColor: '#fa8c16',
    iconBgColor: 'rgba(250, 140, 22, 0.1)',
    iconColor: '#fa8c16',
    hoverColor: '#ffa940',
    onClick: () => {
      console.log('查看处理中任务')
    },
  },
]

function StatisticCards() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // 使用 useCallback 优化事件处理函数
  const handleMouseEnter = useCallback((index: number) => {
    setHoveredIndex(index)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null)
  }, [])

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      {statisticData.map((item, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card
            hoverable
            onClick={item.onClick}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            style={{
              cursor: item.onClick ? 'pointer' : 'default',
              transition: 'all 0.3s ease',
              border: `2px solid ${hoveredIndex === index ? item.hoverColor : 'transparent'}`,
              boxShadow:
                hoveredIndex === index
                  ? `0 4px 12px ${item.iconBgColor}`
                  : '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  backgroundColor: item.iconBgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                  transition: 'all 0.3s ease',
                  transform: hoveredIndex === index ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
                }}
              >
                <span
                  style={{
                    fontSize: 24,
                    color: item.iconColor,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {item.prefix}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <Statistic
                  title={item.title}
                  value={item.value}
                  suffix={item.suffix}
                  styles={{
                    content: { color: item.contentColor },
                    title: { fontSize: 14, marginBottom: 4 },
                  }}
                />
              </div>
              {item.onClick && (
                <div
                  style={{
                    opacity: hoveredIndex === index ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    marginLeft: 8,
                  }}
                >
                  <EyeOutlined style={{ color: item.iconColor, fontSize: 16 }} />
                </div>
              )}
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

// 使用 memo 优化，避免不必要的重渲染
export default memo(StatisticCards)
