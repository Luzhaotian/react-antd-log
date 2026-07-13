import { useMemo, useCallback, useContext, createContext } from 'react'
import { Popconfirm, Tag, Tooltip, Typography } from 'antd'

const { Text } = Typography
import {
  RiseOutlined,
  FallOutlined,
  LineChartOutlined,
  DeleteOutlined,
  HolderOutlined,
  EditOutlined,
} from '@ant-design/icons'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import DataTable from '@/components/DataTable'
import TextButton from '@/components/TextButton'
import type { ColumnsType } from 'antd/es/table'
import type { FundInfo, RowContextProps, FundTableProps, SortableRowProps } from '@/types'
import {
  calcHoldingMetrics,
  fundsHaveRealtime,
  getChangeColor,
  getChangePct,
  getEstimateDeviation,
  getYesterdayChangePct,
} from '@/utils'

const RowContext = createContext<RowContextProps>({})

function DragHandle() {
  const { setActivatorNodeRef, listeners } = useContext(RowContext)
  return (
    <HolderOutlined
      ref={setActivatorNodeRef}
      className="cursor-grab text-gray-400 hover:text-gray-600"
      {...listeners}
    />
  )
}

function SortableRow({ children, ...props }: SortableRowProps) {
  const id = props['data-row-key']
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  }

  const contextValue = useMemo<RowContextProps>(
    () => ({
      setActivatorNodeRef,
      listeners: listeners as Record<string, (...args: unknown[]) => void> | undefined,
    }),
    [setActivatorNodeRef, listeners]
  )

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes}>
        {children}
      </tr>
    </RowContext.Provider>
  )
}

function renderChangePct(value: number | null) {
  if (value === null) return '--'
  const color = getChangeColor(value)
  const icon =
    value > 0 ? <RiseOutlined /> : value < 0 ? <FallOutlined /> : <span className="w-3.5" />
  return (
    <span className="font-mono font-semibold flex items-center justify-end gap-1" style={{ color }}>
      {icon}
      {value > 0 ? '+' : ''}
      {value.toFixed(2)}%
    </span>
  )
}

function renderMoney(value: number | null, showSign = true) {
  if (value === null) return '--'
  const color = getChangeColor(value)
  return (
    <span className="font-mono font-medium" style={{ color }}>
      {showSign && value > 0 ? '+' : ''}
      {value.toFixed(2)}
    </span>
  )
}

function FundTable({
  dataSource,
  loading,
  holdings,
  onViewDetail,
  onViewChart,
  onEditHolding,
  onDelete,
  onReorder,
}: FundTableProps) {
  const hasRealtimeData = useMemo(() => fundsHaveRealtime(dataSource), [dataSource])

  const columns: ColumnsType<FundInfo> = useMemo(
    () => [
      {
        key: 'drag',
        width: 40,
        align: 'center' as const,
        render: () => <DragHandle />,
      },
      {
        title: '基金代码',
        dataIndex: 'FCODE',
        key: 'FCODE',
        width: 96,
        fixed: 'left',
        render: (code: string) => (
          <span className="font-mono text-blue-600 font-medium">{code}</span>
        ),
      },
      {
        title: '基金名称',
        dataIndex: 'SHORTNAME',
        key: 'SHORTNAME',
        width: 128,
        fixed: 'left',
        ellipsis: { showTitle: false },
        render: (name: string, record: FundInfo) => (
          <div className="min-w-0 max-w-[128px]">
            <Text
              ellipsis={{ tooltip: name }}
              className="block max-w-full text-[#1677ff] hover:text-[#4096ff] cursor-pointer"
              onClick={() => onViewDetail(record)}
            >
              {name}
            </Text>
            {holdings[record.FCODE]?.group && (
              <Tag className="mt-1" bordered={false}>
                {holdings[record.FCODE].group}
              </Tag>
            )}
          </div>
        ),
      },
      {
        title: '份额',
        key: 'shares',
        width: 88,
        align: 'right' as const,
        render: (_, record) => {
          const holding = holdings[record.FCODE]
          if (!holding) {
            return <TextButton onClick={() => onEditHolding(record)}>录入</TextButton>
          }
          return (
            <TextButton onClick={() => onEditHolding(record)}>
              {holding.shares.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}
            </TextButton>
          )
        },
      },
      {
        title: '成本',
        key: 'costPrice',
        width: 80,
        align: 'right' as const,
        render: (_, record) => {
          const cost = holdings[record.FCODE]?.costPrice
          return (
            <span className="font-mono text-xs text-gray-600">{cost ? cost.toFixed(4) : '--'}</span>
          )
        },
      },
      {
        title: '单位净值',
        dataIndex: 'NAV',
        key: 'NAV',
        width: 92,
        align: 'right' as const,
        render: (nav: string) => (
          <span className="font-mono">{nav ? Number(nav).toFixed(4) : '--'}</span>
        ),
      },
      {
        title: hasRealtimeData ? '估算净值' : '净值',
        dataIndex: 'GSZ',
        key: 'GSZ',
        width: 92,
        align: 'right' as const,
        render: (gsz: string, record: FundInfo) => {
          const value = hasRealtimeData && gsz ? gsz : record.NAV
          return (
            <span className="font-mono font-medium">{value ? Number(value).toFixed(4) : '--'}</span>
          )
        },
      },
      {
        title: hasRealtimeData ? '估算涨跌' : '涨跌',
        dataIndex: 'GSZZL',
        key: 'GSZZL',
        width: 108,
        align: 'right' as const,
        sorter: (a: FundInfo, b: FundInfo) => {
          const aValue = getChangePct(a, hasRealtimeData) ?? 0
          const bValue = getChangePct(b, hasRealtimeData) ?? 0
          return aValue - bValue
        },
        render: (_, record) => renderChangePct(getChangePct(record, hasRealtimeData)),
      },
      ...(hasRealtimeData
        ? [
            {
              title: '昨日涨跌',
              key: 'NAVCHGRT',
              width: 100,
              align: 'right' as const,
              render: (_: unknown, record: FundInfo) =>
                renderChangePct(getYesterdayChangePct(record)),
            },
            {
              title: '估算偏差',
              key: 'deviation',
              width: 96,
              align: 'right' as const,
              render: (_: unknown, record: FundInfo) => {
                const deviation = getEstimateDeviation(record, true)
                if (deviation === null) return '--'
                return (
                  <Tooltip title="当日估算涨跌幅 − 昨日净值涨跌幅（百分点）">
                    <span
                      className="font-mono text-xs font-medium"
                      style={{ color: getChangeColor(deviation) }}
                    >
                      {deviation > 0 ? '+' : ''}
                      {deviation.toFixed(2)}
                    </span>
                  </Tooltip>
                )
              },
            },
          ]
        : []),
      {
        title: hasRealtimeData ? '当日盈亏' : '昨日盈亏',
        key: 'todayProfit',
        width: 112,
        align: 'right' as const,
        sorter: (a: FundInfo, b: FundInfo) => {
          const pa = calcHoldingMetrics(a, holdings[a.FCODE], hasRealtimeData)?.todayProfit ?? 0
          const pb = calcHoldingMetrics(b, holdings[b.FCODE], hasRealtimeData)?.todayProfit ?? 0
          return pa - pb
        },
        render: (_, record) => {
          const metrics = calcHoldingMetrics(record, holdings[record.FCODE], hasRealtimeData)
          if (!metrics || metrics.todayProfit === null) {
            return <span className="text-gray-400">--</span>
          }
          const changePct = getChangePct(record, hasRealtimeData)
          return (
            <div className="text-right leading-tight">
              <div>{renderMoney(metrics.todayProfit)}</div>
              {changePct !== null && (
                <div className="text-xs" style={{ color: getChangeColor(changePct) }}>
                  {changePct > 0 ? '+' : ''}
                  {changePct.toFixed(2)}%
                </div>
              )}
            </div>
          )
        },
      },
      {
        title: '持仓盈亏',
        key: 'profit',
        width: 120,
        align: 'right' as const,
        sorter: (a: FundInfo, b: FundInfo) => {
          const pa = calcHoldingMetrics(a, holdings[a.FCODE], hasRealtimeData)?.profit ?? 0
          const pb = calcHoldingMetrics(b, holdings[b.FCODE], hasRealtimeData)?.profit ?? 0
          return pa - pb
        },
        render: (_, record) => {
          const metrics = calcHoldingMetrics(record, holdings[record.FCODE], hasRealtimeData)
          if (!metrics) return <span className="text-gray-400">--</span>
          return (
            <div className="text-right leading-tight">
              <div>{renderMoney(metrics.profit)}</div>
              {metrics.profitPct !== null && (
                <div className="text-xs" style={{ color: getChangeColor(metrics.profitPct) }}>
                  {metrics.profitPct > 0 ? '+' : ''}
                  {metrics.profitPct.toFixed(2)}%
                </div>
              )}
            </div>
          )
        },
      },
      {
        title: hasRealtimeData ? '估值时间' : '净值日期',
        dataIndex: hasRealtimeData ? 'GZTIME' : 'PDATE',
        key: hasRealtimeData ? 'GZTIME' : 'PDATE',
        width: 88,
        render: (value: string) => (
          <span className="text-gray-500 text-xs">
            {value ? (hasRealtimeData ? value.split(' ')[1] || value : value) : '--'}
          </span>
        ),
      },
      {
        title: '净值日期',
        dataIndex: 'PDATE',
        key: 'PDATE',
        width: 100,
        render: (value: string, record: FundInfo) => (
          <span className="text-gray-500 text-xs">
            {(hasRealtimeData ? record.GZTIME?.split(' ')[0] : value) || '--'}
          </span>
        ),
      },
      {
        title: '操作',
        key: 'action',
        width: 168,
        fixed: 'right',
        render: (_, record) => (
          <div className="flex gap-1 flex-wrap">
            <TextButton onClick={() => onEditHolding(record)}>
              <EditOutlined /> 持仓
            </TextButton>
            <TextButton onClick={() => onViewChart(record)}>
              <LineChartOutlined /> 走势
            </TextButton>
            <Popconfirm
              title="确认删除"
              description={`确定要删除 ${record.SHORTNAME} 吗？`}
              onConfirm={() => onDelete?.(record.FCODE)}
              okText="确定"
              cancelText="取消"
            >
              <TextButton danger>
                <DeleteOutlined /> 删除
              </TextButton>
            </Popconfirm>
          </div>
        ),
      },
    ],
    [onViewDetail, onViewChart, onEditHolding, onDelete, hasRealtimeData, holdings]
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (over && active.id !== over.id) {
        const activeIndex = dataSource.findIndex(item => item.FCODE === active.id)
        const overIndex = dataSource.findIndex(item => item.FCODE === over.id)
        if (activeIndex !== -1 && overIndex !== -1) {
          const newOrder = arrayMove(
            dataSource.map(item => item.FCODE),
            activeIndex,
            overIndex
          )
          onReorder?.(newOrder)
        }
      }
    },
    [dataSource, onReorder]
  )

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis]}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={dataSource.map(item => item.FCODE)}
        strategy={verticalListSortingStrategy}
      >
        <DataTable<FundInfo>
          dataSource={dataSource}
          columns={columns}
          loading={loading}
          rowKey="FCODE"
          pagination={false}
          scroll={{ x: 1620 }}
          size="middle"
          components={{
            body: {
              row: SortableRow,
            },
          }}
        />
      </SortableContext>
    </DndContext>
  )
}

export default FundTable
