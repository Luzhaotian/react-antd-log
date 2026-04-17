import { Button, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { MortgageRecord, MortgageTableHandlers } from '@/types'
import { LOAN_TYPE_LABEL, REPAY_TYPE_LABEL } from '@/constants'

/** 获取房贷计算表格列 */
export function getMortgageColumns(handlers: MortgageTableHandlers): ColumnsType<MortgageRecord> {
  const { onView, onEdit, onDelete } = handlers
  return [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: 140,
    },
    {
      title: '贷款类型',
      dataIndex: 'loanType',
      key: 'loanType',
      width: 100,
      render: (t: MortgageRecord['loanType']) => LOAN_TYPE_LABEL[t],
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
      width: 180,
    },
    {
      title: '平米数（㎡）',
      dataIndex: 'areaSquareMeters',
      key: 'areaSquareMeters',
      width: 120,
      align: 'right',
      render: (v: number) => (v ?? 0).toLocaleString('zh-CN'),
    },
    {
      title: '每平米价格（元/㎡）',
      dataIndex: 'pricePerSquareMeter',
      key: 'pricePerSquareMeter',
      width: 160,
      align: 'right',
      render: (v: number) => (v ?? 0).toLocaleString('zh-CN'),
    },
    {
      title: '首付（元）',
      dataIndex: 'downPayment',
      key: 'downPayment',
      width: 120,
      align: 'right',
      render: (v: number) => (v ?? 0).toLocaleString('zh-CN'),
    },
    {
      title: '贷款金额（元）',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 130,
      align: 'right',
      render: (v: number) => v.toLocaleString('zh-CN'),
    },
    {
      title: '总金额（元）',
      key: 'totalAmountDisplay',
      width: 130,
      align: 'right',
      render: (_: unknown, record: MortgageRecord) => {
        const totalInterest = record.monthlyPayments?.reduce((s, m) => s + m.interest, 0) ?? 0
        const total = (record.downPayment ?? 0) + record.totalAmount + totalInterest
        return total.toLocaleString('zh-CN')
      },
    },
    {
      title: '利息（元）',
      key: 'totalInterest',
      width: 120,
      align: 'right',
      render: (_: unknown, record: MortgageRecord) => {
        const totalInterest = record.monthlyPayments?.reduce((s, m) => s + m.interest, 0) ?? 0
        return totalInterest.toLocaleString('zh-CN')
      },
    },
    {
      title: '年利率（%）',
      dataIndex: 'annualRate',
      key: 'annualRate',
      width: 120,
      align: 'right',
    },
    {
      title: '期限（月）',
      dataIndex: 'termMonths',
      key: 'termMonths',
      width: 100,
      align: 'right',
    },
    {
      title: '还款方式',
      dataIndex: 'repayType',
      key: 'repayType',
      width: 100,
      render: (t: MortgageRecord['repayType']) => REPAY_TYPE_LABEL[t],
    },
    {
      title: '首月还款（元）',
      key: 'firstPayment',
      width: 160,
      align: 'right',
      render: (_: unknown, record: MortgageRecord) => {
        const first = record.monthlyPayments?.[0]
        return first
          ? first.monthlyPayment.toLocaleString('zh-CN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : '—'
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_: unknown, record: MortgageRecord) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => onView(record)}>
            查看
          </Button>
          <Button type="link" size="small" onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" danger onClick={() => onDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]
}
