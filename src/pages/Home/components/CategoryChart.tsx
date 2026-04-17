import { useMemo, memo } from 'react'
import { Card } from 'antd'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import type { CategoryChartProps } from '@/types'

function CategoryChart({ data }: CategoryChartProps) {
  // 使用 useMemo 缓存 option，避免每次渲染都重新创建
  const option: EChartsOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
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
        data: data.map(item => item.type),
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: data.map(item => item.value),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#1890ff' },
                { offset: 1, color: '#40a9ff' },
              ],
            },
            borderRadius: [8, 8, 0, 0],
          },
          barWidth: '60%',
        },
      ],
      animation: true,
      animationDuration: 1000, // 减少动画时间，提升性能
    }),
    [data]
  )

  return (
    <Card title="分类统计" style={{ height: '100%' }}>
      <ReactECharts
        option={option}
        style={{ height: '300px', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </Card>
  )
}

// 使用 memo 优化，避免不必要的重渲染
export default memo(CategoryChart)
