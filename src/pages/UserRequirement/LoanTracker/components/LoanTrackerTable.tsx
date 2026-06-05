import { useMemo } from 'react'
import { Button, Tag, Space, Tooltip } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import DataTable from '@/components/DataTable'
import type { LoanTrackerRecord, RepaymentStatus } from '@/types'
import { formatMoney } from '@/utils'
import dayjs from 'dayjs'

interface LoanTrackerTableProps {
  record: LoanTrackerRecord
  onMarkPaid: (period: number, amount: number) => void
  onMarkUnpaid: (period: number) => void
}

export default function LoanTrackerTable({
  record,
  onMarkPaid,
  onMarkUnpaid,
}: LoanTrackerTableProps) {
  // 表格列定义
  const columns = useMemo(
    () => [
      {
        title: '期数',
        dataIndex: 'period',
        key: 'period',
        width: 60,
        align: 'center' as const,
      },
      {
        title: '应还日期',
        dataIndex: 'dueDate',
        key: 'dueDate',
        width: 130,
        render: (date: string, row: RepaymentStatus) => {
          const d = dayjs(date)
          const today = dayjs().startOf('day')
          const due = d.startOf('day')
          const isPast = due.isBefore(today) && !row.paid
          const daysLeft = due.diff(today, 'day')
          return (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span style={{ color: isPast ? '#ff4d4f' : undefined }}>{date}</span>
              {isPast && (
                <Tooltip title="已过还款日">
                  <Tag color="error" className="m-0 text-xs">
                    逾期
                  </Tag>
                </Tooltip>
              )}
              {!isPast && !row.paid && daysLeft <= 7 && daysLeft > 0 && (
                <Tooltip title={`还有 ${daysLeft} 天`}>
                  <Tag color="warning" className="m-0 text-xs">
                    {daysLeft}天
                  </Tag>
                </Tooltip>
              )}
            </div>
          )
        },
      },
      {
        title: '月供金额',
        dataIndex: 'monthlyPayment',
        key: 'monthlyPayment',
        width: 120,
        align: 'right' as const,
        render: (v: number) => <span className="font-medium">{formatMoney(v)}</span>,
      },
      {
        title: '本金',
        dataIndex: 'principal',
        key: 'principal',
        width: 120,
        align: 'right' as const,
        render: (v: number) => formatMoney(v),
      },
      {
        title: '利息',
        dataIndex: 'interest',
        key: 'interest',
        width: 120,
        align: 'right' as const,
        render: (v: number) => formatMoney(v),
      },
      {
        title: '剩余本金',
        dataIndex: 'remainingPrincipal',
        key: 'remainingPrincipal',
        width: 130,
        align: 'right' as const,
        render: (v: number) => formatMoney(v),
      },
      {
        title: '状态',
        dataIndex: 'paid',
        key: 'paid',
        width: 80,
        align: 'center' as const,
        render: (paid: boolean) =>
          paid ? (
            <Tag color="success" icon={<CheckCircleOutlined />} className="m-0">
              已还
            </Tag>
          ) : (
            <Tag icon={<CloseCircleOutlined />} className="m-0">
              未还
            </Tag>
          ),
      },
      {
        title: '操作',
        key: 'action',
        width: 120,
        align: 'center' as const,
        render: (_: unknown, row: RepaymentStatus) => (
          <Space size="small">
            {!row.paid ? (
              <Button
                type="link"
                size="small"
                onClick={() => onMarkPaid(row.period, row.monthlyPayment)}
              >
                标记已还
              </Button>
            ) : (
              <Button type="link" size="small" danger onClick={() => onMarkUnpaid(row.period)}>
                取消
              </Button>
            )}
          </Space>
        ),
      },
    ],
    [onMarkPaid, onMarkUnpaid]
  )

  return (
    <DataTable<RepaymentStatus>
      columns={columns}
      dataSource={record.repayments}
      rowKey="period"
      size="small"
      pagination={{
        pageSize: 12,
        showSizeChanger: true,
        showTotal: t => `共 ${t} 期`,
        pageSizeOptions: ['12', '24', '48', '96', '120'],
      }}
      scroll={{ x: 900 }}
      rowClassName={row => (row.paid ? 'bg-green-50/50' : '')}
    />
  )
}
