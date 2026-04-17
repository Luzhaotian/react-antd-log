import { Tag, Tooltip } from 'antd'
import {
  BlockOutlined,
  OrderedListOutlined,
  FontSizeOutlined,
  NumberOutlined,
  CheckOutlined,
  StopOutlined,
  QuestionOutlined,
} from '@ant-design/icons'
import type { JsonValue, DepthColors } from '@/types'

// 获取值的类型
export function getValueType(value: JsonValue): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value
}

// 获取类型中文名称
export function getTypeText(type: string): string {
  const typeMap: Record<string, string> = {
    object: '对象',
    array: '数组',
    string: '字符串',
    number: '数字',
    boolean: '布尔值',
    null: '空值',
  }
  return typeMap[type] || type
}

// 获取类型图标 - 使用 Ant Design Icon
export function getTypeIcon(type: string): React.ReactNode {
  const iconMap: Record<string, React.ReactNode> = {
    object: <BlockOutlined />,
    array: <OrderedListOutlined />,
    string: <FontSizeOutlined />,
    number: <NumberOutlined />,
    boolean: <CheckOutlined />,
    null: <StopOutlined />,
  }
  return iconMap[type] || <QuestionOutlined />
}

// 获取类型对应的 Tag 颜色
export function getTypeTagColor(type: string): string {
  const colors: Record<string, string> = {
    string: 'green',
    number: 'blue',
    boolean: 'purple',
    null: 'default',
    array: 'cyan',
    object: 'geekblue',
  }
  return colors[type] || 'default'
}

// 每条最左侧一竖条浅色区分层级，循环 8 色（浅色 + 柔和）
export function getDepthColors(depth: number): DepthColors {
  const colors: DepthColors[] = [
    { barBg: 'bg-blue-300', accent: 'text-blue-600', border: 'border-gray-200' },
    { barBg: 'bg-cyan-300', accent: 'text-cyan-600', border: 'border-gray-200' },
    { barBg: 'bg-emerald-300', accent: 'text-emerald-600', border: 'border-gray-200' },
    { barBg: 'bg-amber-300', accent: 'text-amber-600', border: 'border-gray-200' },
    { barBg: 'bg-orange-300', accent: 'text-orange-600', border: 'border-gray-200' },
    { barBg: 'bg-rose-300', accent: 'text-rose-600', border: 'border-gray-200' },
    { barBg: 'bg-violet-300', accent: 'text-violet-600', border: 'border-gray-200' },
    { barBg: 'bg-indigo-300', accent: 'text-indigo-600', border: 'border-gray-200' },
  ]
  const index = depth % colors.length
  return colors[index]
}

// 格式化显示值
export function formatValue(value: JsonValue, type: string): React.ReactNode {
  if (type === 'null') {
    return <Tag color="default">null</Tag>
  }
  if (type === 'boolean') {
    return <Tag color={value ? 'success' : 'error'}>{String(value)}</Tag>
  }
  if (type === 'number') {
    return <Tag color="blue">{String(value)}</Tag>
  }
  if (type === 'string') {
    const str = value as string
    const displayStr = str.length > 100 ? str.slice(0, 100) + '...' : str
    return (
      <Tooltip title={str.length > 100 ? str : undefined} overlayStyle={{ maxWidth: 600 }}>
        <span className="text-green-600">"{displayStr}"</span>
      </Tooltip>
    )
  }
  return String(value)
}

// 获取值摘要
export function getValueSummary(value: JsonValue, type: string): string {
  if (type === 'object') {
    const keys = Object.keys(value as object)
    return `{ ${keys.length} 个属性 }`
  }
  if (type === 'array') {
    return `[ ${(value as JsonValue[]).length} 个元素 ]`
  }
  return String(value)
}

// 计算 JSON 项目数量
export function countJsonItems(obj: JsonValue): number {
  let count = 0
  function countItems(item: JsonValue) {
    if (item && typeof item === 'object') {
      count++
      if (Array.isArray(item)) {
        item.forEach(countItems)
      } else {
        Object.values(item).forEach(countItems)
      }
    } else {
      count++
    }
  }
  countItems(obj)
  return count
}
