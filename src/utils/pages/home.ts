import type { TrendData, CategoryData, PieData, PerformanceData } from '@/types'

export const generateTrendData = (): TrendData[] => {
  const dates: string[] = []
  const values: number[] = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    dates.push(date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }))
    values.push(Math.floor(Math.random() * 100) + 50)
  }
  return dates.map((date, index) => ({ date, value: values[index] }))
}

export const generateCategoryData = (): CategoryData[] => {
  const categories = ['科技', '娱乐', '体育', '财经', '社会', '其他']
  return categories.map(category => ({
    type: category,
    value: Math.floor(Math.random() * 500) + 100,
  }))
}

export const generatePieData = (): PieData[] => {
  // 生成4个随机百分比值，确保总和为100
  // 方法：生成4个随机数，然后归一化到100
  const randomValues = [
    Math.random(), // 已处理
    Math.random(), // 待处理
    Math.random(), // 进行中
    Math.random(), // 已完成
  ]

  // 计算总和
  const total = randomValues.reduce((sum, val) => sum + val, 0)

  // 归一化到100，并四舍五入
  const normalizedValues = randomValues.map(val => Math.round((val / total) * 100))

  // 处理四舍五入误差，确保总和为100
  const currentTotal = normalizedValues.reduce((sum, val) => sum + val, 0)

  const diff = 100 - currentTotal

  // 将差值加到第一个值上（如果diff不为0）
  if (diff !== 0) {
    normalizedValues[0] += diff
  }

  return [
    { type: '已处理', value: normalizedValues[0] },
    { type: '待处理', value: normalizedValues[1] },
    { type: '进行中', value: normalizedValues[2] },
    { type: '已完成', value: normalizedValues[3] },
  ]
}

export const generatePerformanceData = (): PerformanceData[] => {
  return [
    { label: 'CPU 使用率', value: Math.floor(Math.random() * 40) + 40, color: '#1890ff' },
    { label: '内存使用率', value: Math.floor(Math.random() * 30) + 30, color: '#52c41a' },
    { label: '存储使用率', value: Math.floor(Math.random() * 30) + 50, color: '#faad14' },
    { label: '网络带宽', value: Math.floor(Math.random() * 40) + 20, color: '#722ed1' },
  ]
}
