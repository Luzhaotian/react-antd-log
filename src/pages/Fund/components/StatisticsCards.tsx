import { useMemo } from 'react'
import { Card, Statistic, Row, Col } from 'antd'
import { RiseOutlined, FallOutlined, MinusOutlined, FundOutlined } from '@ant-design/icons'
import type { StatisticsCardsProps } from '@/types'

function StatisticsCards({ funds }: StatisticsCardsProps) {
  const stats = useMemo(() => {
    let riseCount = 0
    let fallCount = 0
    let flatCount = 0
    let totalChange = 0
    let maxRise = { code: '', name: '', value: -Infinity }
    let maxFall = { code: '', name: '', value: Infinity }
    let hasRealtimeData = false // 是否有实时估值数据

    funds.forEach(fund => {
      // 优先使用估算涨跌幅(GSZZL)，没有则使用日涨跌幅(NAVCHGRT)
      const gszzl = fund.GSZZL ? Number(fund.GSZZL) : NaN
      const navchgrt = fund.NAVCHGRT ? Number(fund.NAVCHGRT) : NaN

      // 如果 GSZZL 有值，说明有实时估值数据
      if (!isNaN(gszzl)) {
        hasRealtimeData = true
      }

      const change = !isNaN(gszzl) ? gszzl : !isNaN(navchgrt) ? navchgrt : 0
      totalChange += change

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

    const avgChange = funds.length > 0 ? totalChange / funds.length : 0

    return {
      total: funds.length,
      riseCount,
      fallCount,
      flatCount,
      avgChange,
      maxRise: maxRise.value > -Infinity ? maxRise : null,
      maxFall: maxFall.value < Infinity ? maxFall : null,
      hasRealtimeData, // 是否使用实时数据
    }
  }, [funds])

  return (
    <Row gutter={[16, 16]} className="mb-4">
      <Col xs={12} sm={8} lg={4}>
        <Card size="small" className="h-full">
          <Statistic
            title="监控基金"
            value={stats.total}
            prefix={<FundOutlined className="text-blue-500" />}
            suffix="只"
          />
        </Card>
      </Col>
      <Col xs={12} sm={8} lg={4}>
        <Card size="small" className="h-full">
          <Statistic
            title={stats.hasRealtimeData ? '上涨数量' : '昨日上涨'}
            value={stats.riseCount}
            styles={{ content: { color: '#f5222d' } }}
            prefix={<RiseOutlined />}
            suffix="只"
          />
        </Card>
      </Col>
      <Col xs={12} sm={8} lg={4}>
        <Card size="small" className="h-full">
          <Statistic
            title={stats.hasRealtimeData ? '下跌数量' : '昨日下跌'}
            value={stats.fallCount}
            styles={{ content: { color: '#52c41a' } }}
            prefix={<FallOutlined />}
            suffix="只"
          />
        </Card>
      </Col>
      <Col xs={12} sm={8} lg={4}>
        <Card size="small" className="h-full">
          <Statistic
            title={stats.hasRealtimeData ? '持平数量' : '昨日持平'}
            value={stats.flatCount}
            styles={{ content: { color: '#666' } }}
            prefix={<MinusOutlined />}
            suffix="只"
          />
        </Card>
      </Col>
      <Col xs={12} sm={8} lg={4}>
        <Card size="small" className="h-full">
          <Statistic
            title={stats.hasRealtimeData ? '平均涨跌' : '昨日平均'}
            value={stats.avgChange}
            precision={2}
            styles={{
              content: {
                color: stats.avgChange > 0 ? '#f5222d' : stats.avgChange < 0 ? '#52c41a' : '#666',
              },
            }}
            prefix={
              stats.avgChange > 0 ? <RiseOutlined /> : stats.avgChange < 0 ? <FallOutlined /> : null
            }
            suffix="%"
          />
        </Card>
      </Col>
      <Col xs={12} sm={8} lg={4}>
        <Card size="small" className="h-full">
          {stats.maxRise ? (
            <div>
              <div className="text-xs text-gray-500 mb-1">
                {stats.hasRealtimeData ? '今日领涨' : '昨日领涨'}
              </div>
              <div className="text-red-500 font-semibold text-lg">
                +{stats.maxRise.value.toFixed(2)}%
              </div>
              <div className="text-xs text-gray-600 truncate" title={stats.maxRise.name}>
                {stats.maxRise.code} {stats.maxRise.name}
              </div>
            </div>
          ) : (
            <Statistic title={stats.hasRealtimeData ? '今日领涨' : '昨日领涨'} value="--" />
          )}
        </Card>
      </Col>
    </Row>
  )
}

export default StatisticsCards
