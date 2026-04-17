import { useMemo, memo } from 'react'
import { Card } from 'antd'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import type { TrendChartProps } from '@/types'

function TrendChart({ data }: TrendChartProps) {
  // 使用 useMemo 缓存 option，避免每次渲染都重新创建
  const option: EChartsOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
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
        data: data.map(item => item.date),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '热点数量',
          type: 'line',
          smooth: true,
          data: data.map(item => item.value),
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
              ],
            },
          },
          itemStyle: {
            color: '#1890ff',
          },
          lineStyle: {
            color: '#1890ff',
            width: 2,
          },
          symbol: 'circle',
          symbolSize: 6,
        },
      ],
      animation: true,
      animationDuration: 1000, // 减少动画时间，提升性能
    }),
    [data]
  )

  return (
    <Card title="近7天热点趋势" style={{ height: '100%' }}>
      <ReactECharts
        option={option}
        style={{ height: '300px', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </Card>
  )
}

// 使用 memo 优化，避免不必要的重渲染
export default memo(TrendChart)
