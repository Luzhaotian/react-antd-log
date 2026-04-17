import { useMemo } from 'react'
import { Table } from 'antd'
import type { MonthlyPaymentItem } from '@/types'

const formatMoney = (v: number) =>
  v.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

const monthColumns = [
  {
    title: '期数',
    dataIndex: 'period',
    key: 'period',
    width: 72,
    align: 'right' as const,
  },
  {
    title: '月供（元）',
    dataIndex: 'monthlyPayment',
    key: 'monthlyPayment',
    align: 'right' as const,
    render: (v: number) => formatMoney(v),
  },
  {
    title: '本金（元）',
    dataIndex: 'principal',
    key: 'principal',
    align: 'right' as const,
    render: (v: number) => formatMoney(v),
  },
  {
    title: '利息（元）',
    dataIndex: 'interest',
    key: 'interest',
    align: 'right' as const,
    render: (v: number) => formatMoney(v),
  },
  {
    title: '剩余本金（元）',
    dataIndex: 'remainingPrincipal',
    key: 'remainingPrincipal',
    align: 'right' as const,
    render: (v: number) => formatMoney(v),
  },
]

export interface MonthlyPaymentTableProps {
  dataSource: MonthlyPaymentItem[]
  currentPage: number
  pageSize: number
  onPageChange: (page: number, size?: number) => void
}

export function MonthlyPaymentTable({
  dataSource,
  currentPage,
  pageSize,
  onPageChange,
}: MonthlyPaymentTableProps) {
  const paginationConfig = useMemo(
    () => ({
      current: currentPage,
      pageSize,
      showSizeChanger: true,
      showTotal: (total: number) => `共 ${total} 期`,
      pageSizeOptions: [12, 24, 48, 96, 120],
      onChange: (page: number, size?: number) => {
        onPageChange(page, size)
      },
    }),
    [currentPage, pageSize, onPageChange]
  )

  return (
    <Table<MonthlyPaymentItem>
      size="small"
      columns={monthColumns}
      dataSource={dataSource}
      rowKey="period"
      pagination={paginationConfig}
      scroll={{ y: 480 }}
    />
  )
}
