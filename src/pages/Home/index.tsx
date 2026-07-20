import { useState, useCallback, lazy, Suspense } from 'react'
import { Row, Col, Button, Spin } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import type { TrendData, CategoryData, PieData, PerformanceData } from '@/types'
import { recentActivities } from '@/constants'
import {
  PageHeader,
  StatisticCards,
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

const TrendChart = lazy(() => import('./components/TrendChart'))
const CategoryChart = lazy(() => import('./components/CategoryChart'))
const StatusPieChart = lazy(() => import('./components/StatusPieChart'))

function ChartFallback() {
  return (
    <div className="flex-center min-h-[280px]">
      <Spin />
    </div>
  )
}

function Home() {
  const [trendData, setTrendData] = useState<TrendData[]>(() => generateTrendData())
  const [categoryData, setCategoryData] = useState<CategoryData[]>(() => generateCategoryData())
  const [pieData, setPieData] = useState<PieData[]>(() => generatePieData())
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>(() =>
    generatePerformanceData()
  )

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

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Suspense fallback={<ChartFallback />}>
            <TrendChart data={trendData} />
          </Suspense>
        </Col>
        <Col xs={24} lg={8}>
          <Suspense fallback={<ChartFallback />}>
            <StatusPieChart data={pieData} />
          </Suspense>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Suspense fallback={<ChartFallback />}>
            <CategoryChart data={categoryData} />
          </Suspense>
        </Col>
        <Col xs={24} lg={8}>
          <SystemPerformance data={performanceData} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <RecentActivities activities={recentActivities} />
        </Col>
        <Col xs={24} lg={8}>
          <QuickActions />
        </Col>
      </Row>

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
