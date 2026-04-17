import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Tabs, Spin, Segmented, Empty, message } from 'antd'
import AppModal from '@/components/AppModal'
import ReactECharts from 'echarts-for-react'
import { fetchValuationDetailWithFallback, fetchYieldData, fetchNetValueData } from '@/api/fund'
import type { TimeRange, ValuationData, YieldData, NetValueData, ChartModalProps } from '@/types'
import { DEBOUNCE_DELAY, TIME_RANGE_OPTIONS } from '@/constants'

function ChartModal({ open, fund, onClose }: ChartModalProps) {
  const [activeTab, setActiveTab] = useState('valuation')
  const [timeRange, setTimeRange] = useState<TimeRange>('n')
  const [loading, setLoading] = useState(false)

  // 估值数据
  const [valuationData, setValuationData] = useState<ValuationData[]>([])
  // 收益率数据
  const [yieldData, setYieldData] = useState<YieldData[]>([])
  const [indexName, setIndexName] = useState('基准指数')
  // 净值数据
  const [netValueData, setNetValueData] = useState<NetValueData[]>([])

  // 防抖定时器引用
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 获取估值数据（使用新的 pingzhongdata 接口，带防抖）
  const loadValuationData = useCallback(async (fcode: string) => {
    // 清除之前的定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // 防抖：延迟执行，防止频繁请求被封
    debounceTimerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        // 使用新的兼容接口，优先 pingzhongdata
        const data = await fetchValuationDetailWithFallback(fcode)
        setValuationData(data)
        if (data.length === 0) {
          message.warning('暂无估值分时数据（可能是非交易时段或该基金不支持）')
        }
      } catch (error) {
        console.error('获取估值数据失败:', error)
        message.error('获取估值数据失败')
      } finally {
        setLoading(false)
      }
    }, DEBOUNCE_DELAY)
  }, [])

  // 获取收益率数据
  const loadYieldData = useCallback(async (fcode: string, range: TimeRange) => {
    setLoading(true)
    try {
      const result = await fetchYieldData(fcode, range)
      setYieldData(result.data)
      setIndexName(result.indexName)
    } catch (error) {
      console.error('获取收益率数据失败:', error)
      message.error('获取收益率数据失败')
    } finally {
      setLoading(false)
    }
  }, [])

  // 获取净值数据
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

  // 切换标签或时间范围时加载数据
  useEffect(() => {
    if (!open || !fund) return

    if (activeTab === 'valuation') {
      loadValuationData(fund.FCODE)
    } else if (activeTab === 'yield') {
      loadYieldData(fund.FCODE, timeRange)
    } else if (activeTab === 'netValue') {
      loadNetValueData(fund.FCODE, timeRange)
    }
  }, [open, fund, activeTab, timeRange, loadValuationData, loadYieldData, loadNetValueData])

  // 清理防抖定时器
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // 估值图表配置
  const valuationOption = useMemo(() => {
    if (valuationData.length === 0) return null

    return {
      tooltip: {
        trigger: 'axis',
        formatter: (params: { name: string; value: number }[]) => {
          const item = params[0]
          return `${item.name}<br/>估值: ${item.value.toFixed(4)}`
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
        data: valuationData.map(item => item.time),
        axisLabel: { fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLabel: { fontSize: 11 },
      },
      series: [
        {
          name: '估值',
          type: 'line',
          smooth: true,
          data: valuationData.map(item => Number(item.value)),
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(24, 144, 255, 0.4)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
              ],
            },
          },
          lineStyle: { color: '#1890ff', width: 2 },
          itemStyle: { color: '#1890ff' },
        },
      ],
    }
  }, [valuationData])

  // 收益率图表配置
  const yieldOption = useMemo(() => {
    if (yieldData.length === 0) return null

    return {
      tooltip: {
        trigger: 'axis',
        formatter: (
          params: { seriesName: string; value: number; marker: string; name: string }[]
        ) => {
          let result = params[0]?.name || ''
          params.forEach(item => {
            result += `<br/>${item.marker}${item.seriesName}: ${item.value?.toFixed(2)}%`
          })
          return result
        },
      },
      legend: {
        data: [fund?.SHORTNAME || '基金', indexName],
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
        data: yieldData.map(item => item.PDATE),
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
          name: fund?.SHORTNAME || '基金',
          type: 'line',
          smooth: true,
          data: yieldData.map(item => Number(item.YIELD)),
          lineStyle: { color: '#f5222d', width: 2 },
          itemStyle: { color: '#f5222d' },
          showSymbol: false,
        },
        {
          name: indexName,
          type: 'line',
          smooth: true,
          data: yieldData.map(item => Number(item.INDEXYIED)),
          lineStyle: { color: '#1890ff', width: 2 },
          itemStyle: { color: '#1890ff' },
          showSymbol: false,
        },
      ],
    }
  }, [yieldData, fund, indexName])

  // 净值图表配置
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
      key: 'valuation',
      label: '实时估值',
      children: (
        <div className="h-80">
          {loading ? (
            <div className="h-full flex-center">
              <Spin />
            </div>
          ) : valuationOption ? (
            <ReactECharts option={valuationOption} style={{ height: '100%' }} />
          ) : (
            <Empty description="暂无估值数据" />
          )}
        </div>
      ),
    },
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
