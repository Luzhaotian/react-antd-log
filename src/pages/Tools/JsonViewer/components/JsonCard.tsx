import { useMemo } from 'react'
import { Card, Tag } from 'antd'
import type { JsonCardProps, JsonValue } from '@/types'
import { getValueType, getTypeText, getTypeIcon, formatValue } from '@/utils'
import PropertyItem from './PropertyItem'

function JsonCard({ title, data, searchKeyword = '' }: JsonCardProps) {
  const valueType = getValueType(data)
  const typeText = getTypeText(valueType)

  const itemCount = useMemo(() => {
    if (valueType === 'object') return Object.keys(data as object).length
    if (valueType === 'array') return (data as JsonValue[]).length
    return 1
  }, [data, valueType])

  const countText = useMemo(() => {
    if (valueType === 'object') return `${itemCount} 个属性`
    if (valueType === 'array') return `${itemCount} 个元素`
    return '1 个值'
  }, [valueType, itemCount])

  return (
    <Card
      size="small"
      title={
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-lg">{getTypeIcon(valueType)}</span>
          <span>{title}</span>
          <Tag color="blue">{typeText}</Tag>
          <Tag>{countText}</Tag>
        </div>
      }
    >
      {valueType === 'object' ? (
        <div className="overflow-x-auto">
          <div className="text-sm text-gray-500 mb-3 pb-2">
            {title} 的属性 · {itemCount} 个
          </div>
          <div className="flex flex-col gap-3 min-w-0">
            {Object.entries(data as object).map(([key, value]) => (
              <PropertyItem
                key={key}
                keyName={key}
                value={value as JsonValue}
                depth={0}
                searchKeyword={searchKeyword}
              />
            ))}
          </div>
        </div>
      ) : valueType === 'array' ? (
        <div className="overflow-x-auto">
          <div className="text-sm text-gray-500 mb-3 pb-2">
            {title} 的元素 · {itemCount} 个
          </div>
          <div className="flex flex-col gap-3 min-w-0">
            {(data as JsonValue[]).map((item, index) => (
              <PropertyItem
                key={index}
                keyName={String(index)}
                value={item}
                depth={0}
                isArrayItem
                index={index}
                searchKeyword={searchKeyword}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-lg">{formatValue(data, valueType)}</div>
      )}
    </Card>
  )
}

export default JsonCard
