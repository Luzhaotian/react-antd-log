import { useMemo, memo } from 'react'
import { Card } from 'antd'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import type { StatusPieChartProps } from '@/types'

function StatusPieChart({ data }: StatusPieChartProps) {
  // 使用 useMemo 缓存 option，避免每次渲染都重新创建
  const option: EChartsOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'horizontal',
        bottom: '0%',
        data: data.map(item => item.type),
      },
      series: [
        {
          name: '热点状态',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}: {d}%',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
            },
          },
          data: data.map(item => ({
            value: item.value,
            name: item.type,
          })),
          color: ['#1890ff', '#52c41a', '#faad14', '#f5222d'],
        },
      ],
      animation: true,
      animationDuration: 1000, // 减少动画时间，提升性能
    }),
    [data]
  )

  return (
    <Card title="热点状态分布" style={{ height: '100%' }}>
      <ReactECharts
        option={option}
        style={{ height: '300px', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </Card>
  )
}

// 使用 memo 优化，避免不必要的重渲染
export default memo(StatusPieChart)
