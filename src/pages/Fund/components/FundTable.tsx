import { useMemo, useCallback, useContext, createContext } from 'react'
import { Tooltip, Popconfirm } from 'antd'
import {
  RiseOutlined,
  FallOutlined,
  LineChartOutlined,
  DeleteOutlined,
  HolderOutlined,
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

const RowContext = createContext<RowContextProps>({})

// 拖拽手柄组件
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
    () => ({ setActivatorNodeRef, listeners }),
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

function FundTable({
  dataSource,
  loading,
  onViewDetail,
  onViewChart,
  onDelete,
  onReorder,
}: FundTableProps) {
  // 检测是否有实时估值数据
  const hasRealtimeData = useMemo(() => {
    return dataSource.some(fund => fund.GSZZL && fund.GSZZL !== null && fund.GSZZL !== '')
  }, [dataSource])

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
        width: 100,
        render: (code: string) => (
          <span className="font-mono text-blue-600 font-medium">{code}</span>
        ),
      },
      {
        title: '基金名称',
        dataIndex: 'SHORTNAME',
        key: 'SHORTNAME',
        width: 180,
        ellipsis: true,
        render: (name: string, record: FundInfo) => (
          <Tooltip title={name}>
            <TextButton onClick={() => onViewDetail(record)}>{name}</TextButton>
          </Tooltip>
        ),
      },
      {
        title: '单位净值',
        dataIndex: 'NAV',
        key: 'NAV',
        width: 100,
        align: 'right' as const,
        render: (nav: string) => (
          <span className="font-mono">{nav ? Number(nav).toFixed(4) : '--'}</span>
        ),
      },
      {
        title: hasRealtimeData ? '估算净值' : '净值',
        dataIndex: 'GSZ',
        key: 'GSZ',
        width: 100,
        align: 'right' as const,
        render: (gsz: string, record: FundInfo) => {
          // 如果有实时估值显示估算净值，否则显示单位净值
          const value = hasRealtimeData && gsz ? gsz : record.NAV
          return (
            <span className="font-mono font-medium">{value ? Number(value).toFixed(4) : '--'}</span>
          )
        },
      },
      {
        title: hasRealtimeData ? '估算涨跌幅' : '昨日涨跌幅',
        dataIndex: 'GSZZL',
        key: 'GSZZL',
        width: 120,
        align: 'right' as const,
        sorter: (a: FundInfo, b: FundInfo) => {
          const aValue = hasRealtimeData && a.GSZZL ? Number(a.GSZZL) : Number(a.NAVCHGRT || 0)
          const bValue = hasRealtimeData && b.GSZZL ? Number(b.GSZZL) : Number(b.NAVCHGRT || 0)
          return aValue - bValue
        },
        render: (gszzl: string, record: FundInfo) => {
          // 优先使用实时估值，没有则使用昨日净值涨跌幅
          const value =
            hasRealtimeData && gszzl
              ? Number(gszzl)
              : record.NAVCHGRT
                ? Number(record.NAVCHGRT)
                : null
          if (value === null) return '--'
          const isRise = value > 0
          const color = isRise ? '#f5222d' : value < 0 ? '#52c41a' : '#666'
          const icon = isRise ? <RiseOutlined /> : value < 0 ? <FallOutlined /> : null
          return (
            <span
              className="font-mono font-semibold flex items-center justify-end gap-1"
              style={{ color }}
            >
              {icon}
              {value > 0 ? '+' : ''}
              {value.toFixed(2)}%
            </span>
          )
        },
      },
      {
        title: hasRealtimeData ? '估值时间' : '净值日期',
        dataIndex: hasRealtimeData ? 'GZTIME' : 'PDATE',
        key: hasRealtimeData ? 'GZTIME' : 'PDATE',
        width: 110,
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
        width: 110,
        render: (value: string, record: FundInfo) => (
          <span className="text-gray-500 text-xs">
            {(hasRealtimeData ? record.GZTIME?.split(' ')[0] : value) || '--'}
          </span>
        ),
      },
      {
        title: '操作',
        key: 'action',
        width: 140,
        fixed: 'right',
        render: (_, record: FundInfo) => (
          <div className="flex gap-2">
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
    [onViewDetail, onViewChart, onDelete, hasRealtimeData]
  )

  // 拖拽传感器配置
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

  // 拖拽结束处理
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
          scroll={{ x: 1000 }}
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
