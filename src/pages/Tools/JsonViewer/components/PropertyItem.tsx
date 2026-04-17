import { useMemo } from 'react'
import { Collapse, Typography, Tag, Tooltip } from 'antd'
import { CaretRightFilled } from '@ant-design/icons'
import type { PropertyItemProps, JsonValue, ItemHeaderProps } from '@/types'
import {
  getValueType,
  getTypeTagColor,
  getDepthColors,
  formatValue,
  getValueSummary,
} from '@/utils'

const { Text } = Typography

// 自定义折叠箭头：小圆角块 + 三角，仅三角随展开旋转，用层级 accent 色
function ExpandIcon({ isActive, accentClass }: { isActive?: boolean; accentClass: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 transition-colors duration-200 ${isActive ? 'bg-gray-200' : ''}`}
      style={{ marginRight: 6 }}
    >
      <CaretRightFilled
        className={`text-[10px] transition-transform duration-200 ${accentClass}`}
        style={{ transform: isActive ? 'rotate(90deg)' : 'rotate(0deg)' }}
      />
    </span>
  )
}

// 单行头部内容（用于折叠面板 header 或简单项整行）
function ItemHeader({
  depth,
  valueType,
  keyName,
  isArrayItem,
  index,
  summary,
  depthColors,
  isMatch,
}: ItemHeaderProps) {
  return (
    <div
      className={`flex items-center gap-2 flex-wrap ${isMatch ? 'text-yellow-700' : ''}`}
      onClick={e => e.stopPropagation()}
    >
      {depth > 0 && (
        <span className={`text-xs font-mono font-medium ${depthColors.accent}`}>L{depth}</span>
      )}
      <Tag color={getTypeTagColor(valueType)} className="text-xs">
        {valueType}
      </Tag>
      <Tooltip title={keyName.length > 30 ? keyName : undefined}>
        <Text strong className="break-all">
          {isArrayItem
            ? `[${index}]`
            : keyName.length > 30
              ? keyName.slice(0, 30) + '...'
              : keyName}
        </Text>
      </Tooltip>
      {summary !== null && (
        <span className={`text-sm font-medium ${depthColors.accent}`}>{summary}</span>
      )}
    </div>
  )
}

function PropertyItem({
  keyName,
  value,
  depth,
  isArrayItem = false,
  index,
  searchKeyword = '',
}: PropertyItemProps) {
  const valueType = getValueType(value)
  const isComplex = valueType === 'object' || valueType === 'array'
  const depthColors = getDepthColors(depth)

  const isMatch =
    searchKeyword &&
    (keyName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (!isComplex && String(value).toLowerCase().includes(searchKeyword.toLowerCase())))

  const summary = isComplex ? getValueSummary(value, valueType) : null

  const headerNode = useMemo(
    () => (
      <ItemHeader
        depth={depth}
        valueType={valueType}
        keyName={keyName}
        isArrayItem={isArrayItem}
        index={index}
        summary={summary}
        depthColors={depthColors}
        isMatch={isMatch as boolean}
      />
    ),
    [depth, valueType, keyName, isArrayItem, index, summary, depthColors, isMatch]
  )

  // 简单值：单行展示，左侧为完整可见的竖条药丸色块（两端圆角 + 与内容留白）
  if (!isComplex) {
    return (
      <div
        className={`flex rounded-lg border ${depthColors.border} bg-white shadow-sm ${
          isMatch ? '!bg-yellow-50 border-yellow-300' : ''
        }`}
      >
        <div className="flex-shrink-0 flex items-stretch">
          <div
            className={`w-1.5 rounded-full min-h-[1.5rem] flex-shrink-0 ${
              isMatch ? 'bg-yellow-400' : depthColors.barBg
            }`}
            aria-hidden
          />
        </div>
        <div className="flex-1 p-2 flex items-start gap-2 flex-wrap min-w-0">
          <div className="flex-1 min-w-0">{headerNode}</div>
          <div className="text-sm break-all flex-shrink-0">{formatValue(value, valueType)}</div>
        </div>
      </div>
    )
  }

  // 复杂值：用折叠面板包裹，子项递归（仅左侧色条 + 自定义箭头）
  const panelKey = isArrayItem ? `arr-${index}` : `obj-${keyName}`

  const expandIcon = useMemo(
    () =>
      ({ isActive }: { isActive?: boolean }) => (
        <ExpandIcon isActive={isActive} accentClass={depthColors.accent} />
      ),
    [depthColors.accent]
  )

  return (
    <div
      className={`flex rounded-lg border ${depthColors.border} bg-white shadow-sm ${
        isMatch ? '!bg-yellow-50 border-yellow-300' : ''
      }`}
    >
      <div className="flex-shrink-0 flex items-stretch">
        <div
          className={`w-1.5 rounded-full min-h-[2.5rem] flex-shrink-0 ${
            isMatch ? 'bg-yellow-400' : depthColors.barBg
          }`}
          aria-hidden
        />
      </div>
      <div
        className={`flex-1 min-w-0 [&_.ant-collapse]:border-0 [&_.ant-collapse-item]:border-0 [&_.ant-collapse-header]:py-2 [&_.ant-collapse-content-box]:pt-0 [&_.ant-collapse-content-box]:pb-2 [&_.ant-collapse-header]:flex [&_.ant-collapse-header]:items-center ${
          isMatch ? '[&_.ant-collapse-item]:!bg-yellow-50' : ''
        }`}
      >
        <Collapse
          ghost
          size="small"
          expandIcon={expandIcon}
          expandIconPosition="start"
          className="border-0 shadow-none"
        >
          <Collapse.Panel header={headerNode} key={panelKey}>
            <div className="flex flex-col gap-2 overflow-x-auto pl-0">
              {valueType === 'object'
                ? Object.entries(value as object).map(([k, v]) => (
                    <PropertyItem
                      key={k}
                      keyName={k}
                      value={v as JsonValue}
                      depth={depth + 1}
                      searchKeyword={searchKeyword}
                    />
                  ))
                : (value as JsonValue[]).map((item, i) => (
                    <PropertyItem
                      key={i}
                      keyName={String(i)}
                      value={item}
                      depth={depth + 1}
                      isArrayItem
                      index={i}
                      searchKeyword={searchKeyword}
                    />
                  ))}
            </div>
          </Collapse.Panel>
        </Collapse>
      </div>
    </div>
  )
}

export default PropertyItem
