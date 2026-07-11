import { useMemo } from 'react'
import { Card, Statistic, Row, Col } from 'antd'
import {
  RiseOutlined,
  FallOutlined,
  MinusOutlined,
  FundOutlined,
  WalletOutlined,
  StockOutlined,
} from '@ant-design/icons'
import type { StatisticsCardsProps } from '@/types'
import { calcPortfolioSummary, fundsHaveRealtime, getChangeColor, getChangePct } from '@/utils'

function StatisticsCards({ funds, holdings }: StatisticsCardsProps) {
  const hasRealtimeData = useMemo(() => fundsHaveRealtime(funds), [funds])

  const portfolio = useMemo(() => calcPortfolioSummary(funds, holdings), [funds, holdings])

  const riseFallStats = useMemo(() => {
    let riseCount = 0
    let fallCount = 0
    let flatCount = 0
    let maxRise = { code: '', name: '', value: -Infinity }
    let maxFall = { code: '', name: '', value: Infinity }

    funds.forEach(fund => {
      const change = getChangePct(fund, hasRealtimeData)
      if (change === null) return

      if (change > 0) {
        riseCount++
        if (change > maxRise.value) {
          maxRise = { code: fund.FCODE, name: fund.SHORTNAME, value: change }
        }
      } else if (change < 0) {
        fallCount++
        if (change < maxFall.value) {
          maxFall = { code: fund.FCODE, name: fund.SHORTNAME, value: change }
        }
      } else {
        flatCount++
      }
    })

    return {
      riseCount,
      fallCount,
      flatCount,
      maxRise: maxRise.value > -Infinity ? maxRise : null,
      maxFall: maxFall.value < Infinity ? maxFall : null,
    }
  }, [funds, hasRealtimeData])

  const changeLabel = hasRealtimeData ? '估算' : '昨日'
  const weightedLabel = portfolio.hasHoldings ? '加权涨跌' : '平均涨跌'

  return (
    <>
      {portfolio.hasHoldings && (
        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={12} sm={8} lg={6}>
            <Card size="small" className="h-full">
              <Statistic
                title="组合总市值"
                value={portfolio.totalMarketValue}
                precision={2}
                prefix={<WalletOutlined className="text-blue-500" />}
                suffix="元"
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <Card size="small" className="h-full">
              <Statistic
                title={`今日${changeLabel}盈亏`}
                value={portfolio.totalTodayProfit}
                precision={2}
                styles={{ content: { color: getChangeColor(portfolio.totalTodayProfit) } }}
                prefix={
                  portfolio.totalTodayProfit > 0 ? (
                    <RiseOutlined />
                  ) : portfolio.totalTodayProfit < 0 ? (
                    <FallOutlined />
                  ) : null
                }
                suffix="元"
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <Card size="small" className="h-full">
              <Statistic
                title="浮动盈亏"
                value={portfolio.totalFloatingProfit}
                precision={2}
                styles={{ content: { color: getChangeColor(portfolio.totalFloatingProfit) } }}
                prefix={<StockOutlined className="text-orange-500" />}
                suffix="元"
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <Card size="small" className="h-full">
              <Statistic
                title={weightedLabel}
                value={portfolio.weightedChange}
                precision={2}
                styles={{ content: { color: getChangeColor(portfolio.weightedChange) } }}
                prefix={
                  portfolio.weightedChange > 0 ? (
                    <RiseOutlined />
                  ) : portfolio.weightedChange < 0 ? (
                    <FallOutlined />
                  ) : null
                }
                suffix="%"
              />
            </Card>
          </Col>
        </Row>
      )}

      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={12} sm={8} lg={4}>
          <Card size="small" className="h-full">
            <Statistic
              title="监控基金"
              value={funds.length}
              prefix={<FundOutlined className="text-blue-500" />}
              suffix="只"
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small" className="h-full">
            <Statistic
              title={hasRealtimeData ? '上涨数量' : '昨日上涨'}
              value={riseFallStats.riseCount}
              styles={{ content: { color: '#f5222d' } }}
              prefix={<RiseOutlined />}
              suffix="只"
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small" className="h-full">
            <Statistic
              title={hasRealtimeData ? '下跌数量' : '昨日下跌'}
              value={riseFallStats.fallCount}
              styles={{ content: { color: '#52c41a' } }}
              prefix={<FallOutlined />}
              suffix="只"
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small" className="h-full">
            <Statistic
              title={hasRealtimeData ? '持平数量' : '昨日持平'}
              value={riseFallStats.flatCount}
              styles={{ content: { color: '#666' } }}
              prefix={<MinusOutlined />}
              suffix="只"
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small" className="h-full">
            <Statistic
              title={portfolio.hasHoldings ? '等权平均' : hasRealtimeData ? '平均涨跌' : '昨日平均'}
              value={portfolio.equalAvgChange}
              precision={2}
              styles={{ content: { color: getChangeColor(portfolio.equalAvgChange) } }}
              prefix={
                portfolio.equalAvgChange > 0 ? (
                  <RiseOutlined />
                ) : portfolio.equalAvgChange < 0 ? (
                  <FallOutlined />
                ) : null
              }
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small" className="h-full">
            {riseFallStats.maxRise ? (
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  {hasRealtimeData ? '今日领涨' : '昨日领涨'}
                </div>
                <div className="text-red-500 font-semibold text-lg">
                  +{riseFallStats.maxRise.value.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-600 truncate" title={riseFallStats.maxRise.name}>
                  {riseFallStats.maxRise.code} {riseFallStats.maxRise.name}
                </div>
              </div>
            ) : (
              <Statistic title={hasRealtimeData ? '今日领涨' : '昨日领涨'} value="--" />
            )}
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small" className="h-full">
            {riseFallStats.maxFall ? (
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  {hasRealtimeData ? '今日领跌' : '昨日领跌'}
                </div>
                <div className="text-green-600 font-semibold text-lg">
                  {riseFallStats.maxFall.value.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-600 truncate" title={riseFallStats.maxFall.name}>
                  {riseFallStats.maxFall.code} {riseFallStats.maxFall.name}
                </div>
              </div>
            ) : (
              <Statistic title={hasRealtimeData ? '今日领跌' : '昨日领跌'} value="--" />
            )}
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default StatisticsCards
