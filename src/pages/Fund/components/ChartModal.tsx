import { useState, useEffect, useCallback, useMemo } from 'react'
import { Tabs, Spin, Segmented, Empty, message } from 'antd'
import AppModal from '@/components/AppModal'
import ReactECharts from 'echarts-for-react'
import { fetchPingzhongNetWorth, fetchNetValueData } from '@/api/fund'
import type { TimeRange, NetValueData, NetWorthTrendPoint, ChartModalProps } from '@/types'
import { TIME_RANGE_OPTIONS } from '@/constants'

/** 根据 timeRange 计算截止时间戳 (ms) */
function getCutoffTimestamp(range: TimeRange): number {
  const now = Date.now()
  const DAY_MS = 24 * 60 * 60 * 1000
  switch (range) {
    case 'y':
      return now - 30 * DAY_MS
    case '3y':
      return now - 90 * DAY_MS
    case '6y':
      return now - 180 * DAY_MS
    case 'n':
      return now - 365 * DAY_MS
    case '3n':
      return now - 1095 * DAY_MS
    default:
      return now - 365 * DAY_MS
  }
}

function ChartModal({ open, fund, onClose }: ChartModalProps) {
  const [activeTab, setActiveTab] = useState('netValue')
  const [timeRange, setTimeRange] = useState<TimeRange>('n')
  const [loading, setLoading] = useState(false)

  // pingzhongdata 净值走势（用于"收益率走势" tab）
  const [netWorthTrend, setNetWorthTrend] = useState<NetWorthTrendPoint[]>([])
  // 净值数据（用于"净值走势" tab）
  const [netValueData, setNetValueData] = useState<NetValueData[]>([])

  // 加载 pingzhongdata（按需，仅 yield 标签页使用）
  const loadPingzhong = useCallback(
    async (fcode: string) => {
      if (netWorthTrend.length > 0) return // 已加载
      setLoading(true)
      try {
        const result = await fetchPingzhongNetWorth(fcode)
        setNetWorthTrend(result.netWorthTrend)
        if (result.netWorthTrend.length === 0) {
          message.warning('暂无收益率走势数据')
        }
      } catch (error) {
        console.error('获取收益率数据失败:', error)
        message.error('获取收益率数据失败')
      } finally {
        setLoading(false)
      }
    },
    [netWorthTrend.length]
  )

  // 加载净值数据
  const loadNetValueData = useCallback(async (fcode: string, range: TimeRange) => {
    setLoading(true)
    try {
      const data = await fetchNetValueData(fcode, range)
      setNetValueData(data)
    } catch (error) {
      console.error('获取净值数据失败:', error)
      message.error('获取净值数据失败')
    } finally {
      setLoading(false)
    }
  }, [])

  // 弹窗打开 / 切换标签时加载数据
  useEffect(() => {
    if (!open || !fund) return

    if (activeTab === 'yield') {
      loadPingzhong(fund.FCODE)
    } else if (activeTab === 'netValue') {
      loadNetValueData(fund.FCODE, timeRange)
    }
  }, [open, fund, activeTab, timeRange, loadPingzhong, loadNetValueData])

  // 重置状态
  useEffect(() => {
    if (!open) {
      setNetWorthTrend([])
      setNetValueData([])
    }
  }, [open])

  // ========== 收益率走势图表（基于 pingzhongdata Data_netWorthTrend.equityReturn） ==========
  const yieldOption = useMemo(() => {
    if (netWorthTrend.length === 0) return null

    const cutoff = getCutoffTimestamp(timeRange)
    const filtered = netWorthTrend.filter(p => p.x >= cutoff)

    if (filtered.length === 0) return null

    return {
      tooltip: {
        trigger: 'axis',
        formatter: (params: { name: string; value: number }[]) => {
          const item = params[0]
          return `${item.name}<br/>累计收益率: ${item.value?.toFixed(2)}%`
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: filtered.map(p => {
          const d = new Date(p.x)
          return `${d.getMonth() + 1}/${d.getDate()}`
        }),
        axisLabel: { fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 11,
          formatter: (value: number) => `${value}%`,
        },
      },
      series: [
        {
          name: '累计收益率',
          type: 'line',
          smooth: true,
          data: filtered.map(p => p.equityReturn),
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(245, 34, 45, 0.3)' },
                { offset: 1, color: 'rgba(245, 34, 45, 0.02)' },
              ],
            },
          },
          lineStyle: { color: '#f5222d', width: 2 },
          itemStyle: { color: '#f5222d' },
          showSymbol: false,
        },
      ],
    }
  }, [netWorthTrend, timeRange])

  // ========== 净值走势图表配置（不变） ==========
  const netValueOption = useMemo(() => {
    if (netValueData.length === 0) return null

    return {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['单位净值', '累计净值'],
        bottom: 0,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '12%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: netValueData.map(item => item.FSRQ),
        axisLabel: { fontSize: 11 },
      },
      yAxis: [
        {
          type: 'value',
          name: '单位净值',
          scale: true,
          axisLabel: { fontSize: 11 },
        },
        {
          type: 'value',
          name: '累计净值',
          scale: true,
          axisLabel: { fontSize: 11 },
        },
      ],
      series: [
        {
          name: '单位净值',
          type: 'line',
          smooth: true,
          yAxisIndex: 0,
          data: netValueData.map(item => Number(item.DWJZ)),
          lineStyle: { color: '#1890ff', width: 2 },
          itemStyle: { color: '#1890ff' },
          showSymbol: false,
        },
        {
          name: '累计净值',
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          data: netValueData.map(item => Number(item.LJJZ)),
          lineStyle: { color: '#52c41a', width: 2 },
          itemStyle: { color: '#52c41a' },
          showSymbol: false,
        },
      ],
    }
  }, [netValueData])

  const tabItems = [
    {
      key: 'yield',
      label: '收益率走势',
      children: (
        <div>
          <div className="mb-4">
            <Segmented
              options={TIME_RANGE_OPTIONS}
              value={timeRange}
              onChange={value => setTimeRange(value as TimeRange)}
            />
          </div>
          <div className="h-72">
            {loading ? (
              <div className="h-full flex-center">
                <Spin />
              </div>
            ) : yieldOption ? (
              <ReactECharts option={yieldOption} style={{ height: '100%' }} />
            ) : (
              <Empty description="暂无收益率数据" />
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'netValue',
      label: '净值走势',
      children: (
        <div>
          <div className="mb-4">
            <Segmented
              options={TIME_RANGE_OPTIONS}
              value={timeRange}
              onChange={value => setTimeRange(value as TimeRange)}
            />
          </div>
          <div className="h-72">
            {loading ? (
              <div className="h-full flex-center">
                <Spin />
              </div>
            ) : netValueOption ? (
              <ReactECharts option={netValueOption} style={{ height: '100%' }} />
            ) : (
              <Empty description="暂无净值数据" />
            )}
          </div>
        </div>
      ),
    },
  ]

  return (
    <AppModal
      title={
        <span>
          <span className="text-blue-600 font-mono mr-2">{fund?.FCODE}</span>
          {fund?.SHORTNAME}
        </span>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnHidden
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
    </AppModal>
  )
}

export default ChartModal
