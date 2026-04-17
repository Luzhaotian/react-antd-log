import { useState, useCallback } from 'react'
import { Row, Col, Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import type { TrendData, CategoryData, PieData, PerformanceData } from '@/types'
import { recentActivities } from '@/constants'
import {
  PageHeader,
  StatisticCards,
  TrendChart,
  CategoryChart,
  StatusPieChart,
  SystemPerformance,
  RecentActivities,
  QuickActions,
} from './components'
import {
  generateTrendData,
  generateCategoryData,
  generatePieData,
  generatePerformanceData,
} from '@/utils'

function Home() {
  const [trendData, setTrendData] = useState<TrendData[]>(() => generateTrendData())
  const [categoryData, setCategoryData] = useState<CategoryData[]>(() => generateCategoryData())
  const [pieData, setPieData] = useState<PieData[]>(() => generatePieData())
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>(() =>
    generatePerformanceData()
  )

  // 刷新所有数据 - 使用 useCallback 优化
  const refreshData = useCallback(() => {
    setTrendData(generateTrendData())
    setCategoryData(generateCategoryData())
    setPieData(generatePieData())
    setPerformanceData(generatePerformanceData())
  }, [])

  return (
    <div style={{ width: '100%' }}>
      <PageHeader />

      <StatisticCards />

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <TrendChart data={trendData} />
        </Col>
        <Col xs={24} lg={8}>
          <StatusPieChart data={pieData} />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <CategoryChart data={categoryData} />
        </Col>
        <Col xs={24} lg={8}>
          <SystemPerformance data={performanceData} />
        </Col>
      </Row>

      {/* 最近活动和快速操作 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <RecentActivities activities={recentActivities} />
        </Col>
        <Col xs={24} lg={8}>
          <QuickActions />
        </Col>
      </Row>

      {/* 悬浮刷新按钮 */}
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<ReloadOutlined />}
        onClick={refreshData}
        style={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          width: 56,
          height: 56,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
        }}
      />
    </div>
  )
}

export default Home
