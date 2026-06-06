import { useState, useCallback, useMemo } from 'react'
import {
  Row,
  Col,
  Card,
  Tag,
  Progress,
  Typography,
  Descriptions,
  DatePicker,
  Modal,
  InputNumber,
  Segmented,
} from 'antd'
import {
  WalletOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  BankOutlined,
  RiseOutlined,
  ExclamationCircleOutlined,
  ThunderboltOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useLocation } from 'react-router-dom'
import LoanTrackerTable from './components/LoanTrackerTable'
import type { LoanTrackerRecord } from '@/types'
import {
  createDefaultLoanTracker,
  loadLoanTracker,
  saveLoanTracker,
  getNextRepayment,
  getRepaymentProgress,
  getDaysUntilDue,
  calcEarlyPayoff,
  calcPayoffDateFromAmount,
  formatMoney,
  calcAmortizationSchedule,
} from '@/utils'

const { Title, Text } = Typography

function initRecord(): LoanTrackerRecord {
  const saved = loadLoanTracker()
  if (saved) return saved
  const defaultRecord = createDefaultLoanTracker()
  saveLoanTracker(defaultRecord)
  return defaultRecord
}

/** 从 MortgageRecord 创建 LoanTrackerRecord */
function createLoanTrackerFromMortgage(
  mortgage: import('@/types').MortgageRecord
): LoanTrackerRecord {
  const now = Date.now()
  const startDate = mortgage.startDate ?? dayjs().format('YYYY-MM-DD')
  const repaymentDay = mortgage.repaymentDay ?? 20
  const endDate =
    mortgage.endDate ?? dayjs(startDate).add(mortgage.termMonths, 'month').format('YYYY-MM-DD')
  const repayments = calcAmortizationSchedule(
    mortgage.totalAmount,
    mortgage.annualRate,
    mortgage.termMonths,
    startDate,
    repaymentDay
  )
  const firstPayment = mortgage.monthlyPayments?.[0]
  const monthlyPayment = firstPayment
    ? firstPayment.monthlyPayment
    : (repayments[0]?.monthlyPayment ?? 0)

  return {
    id: `lt-${now}-${Math.random().toString(36).slice(2, 10)}`,
    createdAt: now,
    updatedAt: now,
    name: mortgage.name,
    loanAmount: mortgage.totalAmount,
    termMonths: mortgage.termMonths,
    startDate,
    repaymentDay,
    annualRate: mortgage.annualRate,
    monthlyPayment,
    repayType: 'equal-payment',
    endDate,
    repayments,
  }
}

interface StatCardConfig {
  title: string
  value: string | number
  suffix?: React.ReactNode
  prefix?: React.ReactNode
  contentColor: string
  extra?: React.ReactNode
}

export default function LoanTracker() {
  const location = useLocation()
  const mortgageData = (
    location.state as { mortgageData?: import('@/types').MortgageRecord } | null
  )?.mortgageData

  const [record, setRecord] = useState<LoanTrackerRecord>(() => {
    // If navigated from mortgage calculator with data, create from it
    if (mortgageData) {
      const tracker = createLoanTrackerFromMortgage(mortgageData)
      saveLoanTracker(tracker)
      return tracker
    }
    return initRecord()
  })
  const [payoffDate, setPayoffDate] = useState<string | null>(null)
  const [payoffResult, setPayoffResult] = useState<ReturnType<typeof calcEarlyPayoff>>(null)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [confirmPeriod, setConfirmPeriod] = useState<number>(0)
  const [confirmAmount, setConfirmAmount] = useState<number>(0)

  // 提前还款模拟 - 模式：按日期 / 按金额
  const [payoffMode, setPayoffMode] = useState<'date' | 'amount'>('date')
  const [inputAmount, setInputAmount] = useState<number | null>(null)
  const [amountResult, setAmountResult] =
    useState<ReturnType<typeof calcPayoffDateFromAmount>>(null)

  const persist = useCallback((r: LoanTrackerRecord) => {
    r.updatedAt = Date.now()
    saveLoanTracker(r)
    setRecord(r)
  }, [])

  const handleMarkPaid = useCallback(
    (period: number) => {
      const next = { ...record }
      next.repayments = next.repayments.map(r => {
        if (r.period === period && !r.paid) {
          return {
            ...r,
            paid: true,
            paidAmount: r.monthlyPayment,
            paidDate: dayjs().format('YYYY-MM-DD'),
          }
        }
        return r
      })
      persist(next)
    },
    [record, persist]
  )

  const handleMarkUnpaid = useCallback(
    (period: number) => {
      const next = { ...record }
      next.repayments = next.repayments.map(r => {
        if (r.period === period && r.paid) {
          return { ...r, paid: false, paidAmount: 0, paidDate: '' }
        }
        return r
      })
      persist(next)
    },
    [record, persist]
  )

  const handleOpenConfirm = useCallback((period: number, amount: number) => {
    setConfirmPeriod(period)
    setConfirmAmount(amount)
    setConfirmModalOpen(true)
  }, [])

  const handleConfirmPaid = useCallback(() => {
    handleMarkPaid(confirmPeriod)
    setConfirmModalOpen(false)
  }, [confirmPeriod, handleMarkPaid])

  const handlePayoffDateChange = useCallback(
    (date: dayjs.Dayjs | null) => {
      if (!date) {
        setPayoffDate(null)
        setPayoffResult(null)
        return
      }
      const dateStr = date.format('YYYY-MM-DD')
      setPayoffDate(dateStr)
      setPayoffResult(calcEarlyPayoff(record, dateStr))
    },
    [record]
  )

  const handleAmountChange = useCallback(
    (val: number | null) => {
      setInputAmount(val)
      if (val == null || val <= 0) {
        setAmountResult(null)
        return
      }
      setAmountResult(calcPayoffDateFromAmount(record, val))
    },
    [record]
  )

  const progress = useMemo(() => getRepaymentProgress(record), [record])
  const daysUntilDue = useMemo(() => getDaysUntilDue(record), [record])
  const nextRepayment = useMemo(() => getNextRepayment(record), [record])

  const countdownColor = useMemo(() => {
    if (daysUntilDue == null) return 'default'
    if (daysUntilDue <= 3) return 'red'
    if (daysUntilDue <= 7) return 'orange'
    return 'green'
  }, [daysUntilDue])

  const statCards: StatCardConfig[] = useMemo(
    () => [
      {
        title: '距离下期还款',
        value: daysUntilDue ?? 0,
        suffix: <span style={{ fontSize: 14 }}>天</span>,
        prefix: <ClockCircleOutlined />,
        contentColor:
          countdownColor === 'red'
            ? '#ff4d4f'
            : countdownColor === 'orange'
              ? '#faad14'
              : '#52c41a',
        extra: nextRepayment ? (
          <div style={{ marginTop: 12, fontSize: 12, color: '#8c8c8c' }}>
            <div>
              第 {nextRepayment.period} 期 · {nextRepayment.dueDate}
            </div>
            <div style={{ marginTop: 4 }}>
              金额{' '}
              <span style={{ color: '#ff4d4f', fontWeight: 600 }}>
                {formatMoney(nextRepayment.monthlyPayment)}
              </span>{' '}
              元
            </div>
          </div>
        ) : undefined,
      },
      {
        title: '还款进度',
        value: progress.progressPercent,
        suffix: <span style={{ fontSize: 14 }}>%</span>,
        prefix: <RiseOutlined />,
        contentColor: '#ff4d4f',
        extra: (
          <div style={{ marginTop: 12 }}>
            <Progress
              percent={progress.progressPercent}
              size="small"
              strokeColor={{ '0%': '#ff4d4f', '100%': '#ff7875' }}
              trailColor="#fff1f0"
              showInfo={false}
            />
            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 6 }}>
              已还 {progress.paidPeriods} / {progress.totalPeriods} 期
            </div>
          </div>
        ),
      },
      {
        title: '已还本金',
        value: progress.totalPrincipalPaid,
        suffix: <span style={{ fontSize: 14 }}>元</span>,
        prefix: <CheckCircleOutlined />,
        contentColor: '#52c41a',
        extra: (
          <div style={{ marginTop: 12, fontSize: 12, color: '#8c8c8c' }}>
            已还利息{' '}
            <span style={{ color: '#fa8c16', fontWeight: 600 }}>
              {formatMoney(progress.totalInterestPaid)}
            </span>{' '}
            元
          </div>
        ),
      },
      {
        title: '剩余本金',
        value: progress.remainingPrincipal,
        suffix: <span style={{ fontSize: 14 }}>元</span>,
        prefix: <WalletOutlined />,
        contentColor: '#1890ff',
        extra: (
          <div style={{ marginTop: 12, fontSize: 12, color: '#8c8c8c' }}>
            待还 <span style={{ color: '#1890ff', fontWeight: 600 }}>{progress.unpaidPeriods}</span>{' '}
            期
          </div>
        ),
      },
    ],
    [daysUntilDue, countdownColor, nextRepayment, progress]
  )

  return (
    <div className="p-4">
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          <BankOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
          房贷还款追踪
        </Title>
        <Text type="secondary">追踪还款进度，管理每期还款状态，数据保存在本地</Text>
      </div>

      {/* 贷款基本信息卡片 */}
      <Card style={{ marginBottom: 16 }} styles={{ body: { padding: '20px 24px' } }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(255, 77, 79, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 10,
            }}
          >
            <BankOutlined style={{ fontSize: 18, color: '#ff4d4f' }} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#1f1f1f' }}>贷款信息</span>
        </div>
        <Descriptions
          column={{ xs: 1, sm: 2, md: 3, lg: 4 }}
          size="small"
          labelStyle={{ fontWeight: 500, color: '#8c8c8c', fontSize: 13 }}
          contentStyle={{ fontSize: 14 }}
        >
          <Descriptions.Item label="贷款金额">
            <span style={{ color: '#ff4d4f', fontWeight: 700 }}>
              {formatMoney(record.loanAmount)}
            </span>{' '}
            元
          </Descriptions.Item>
          <Descriptions.Item label="贷款期限">{record.termMonths} 个月</Descriptions.Item>
          <Descriptions.Item label="年利率">
            <span style={{ fontWeight: 600 }}>{record.annualRate}%</span>
          </Descriptions.Item>
          <Descriptions.Item label="月还款额">
            <span style={{ fontWeight: 600, color: '#1f1f1f' }}>
              {formatMoney(record.monthlyPayment)}
            </span>{' '}
            元
          </Descriptions.Item>
          <Descriptions.Item label="发放日期">{record.startDate}</Descriptions.Item>
          <Descriptions.Item label="到期日期">{record.endDate}</Descriptions.Item>
          <Descriptions.Item label="约定还款日">每月 {record.repaymentDay} 日</Descriptions.Item>
          <Descriptions.Item label="还款方式">等额本息</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {statCards.map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              style={{ height: '100%' }}
              styles={{ body: { padding: '20px 24px', height: '100%' } }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'rgba(255, 77, 79, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                  }}
                >
                  <span style={{ fontSize: 18, color: '#ff4d4f' }}>{item.prefix}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: '#8c8c8c', marginBottom: 4 }}>
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: item.contentColor,
                      lineHeight: 1.2,
                    }}
                  >
                    {typeof item.value === 'number' ? (
                      <span>{formatMoney(item.value)}</span>
                    ) : (
                      item.value
                    )}
                    {item.suffix}
                  </div>
                </div>
              </div>
              {item.extra}
              {daysUntilDue != null && daysUntilDue <= 7 && daysUntilDue > 0 && index === 0 && (
                <Tag color="warning" icon={<ExclamationCircleOutlined />} style={{ marginTop: 8 }}>
                  即将到期
                </Tag>
              )}
              {daysUntilDue != null && daysUntilDue <= 0 && index === 0 && (
                <Tag color="error" icon={<ExclamationCircleOutlined />} style={{ marginTop: 8 }}>
                  已逾期
                </Tag>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {/* 提前还款模拟器 */}
      <Card style={{ marginBottom: 16 }} styles={{ body: { padding: '20px 24px' } }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(250, 140, 22, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 10,
            }}
          >
            <CalendarOutlined style={{ fontSize: 18, color: '#fa8c16' }} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#1f1f1f' }}>提前还款模拟</span>
        </div>

        {/* 模式切换 */}
        <div style={{ marginBottom: 20 }}>
          <Segmented
            value={payoffMode}
            onChange={val => {
              setPayoffMode(val as 'date' | 'amount')
              setPayoffDate(null)
              setPayoffResult(null)
              setInputAmount(null)
              setAmountResult(null)
            }}
            options={[
              {
                label: (
                  <span>
                    <CalendarOutlined /> 按日期计算
                  </span>
                ),
                value: 'date',
              },
              {
                label: (
                  <span>
                    <DollarOutlined /> 按金额计算
                  </span>
                ),
                value: 'amount',
              },
            ]}
          />
        </div>

        {payoffMode === 'date' ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ minWidth: 200, maxWidth: 280 }}>
                <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>
                  选择提前还清日期
                </Text>
                <DatePicker
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                  onChange={handlePayoffDateChange}
                  disabledDate={current => {
                    const today = dayjs().startOf('day')
                    const end = dayjs(record.endDate).endOf('day')
                    return current && (current.isBefore(today) || current.isAfter(end))
                  }}
                />
              </div>
              {payoffResult && (
                <>
                  <div
                    style={{
                      flex: 1,
                      minWidth: 180,
                      background: '#fff7e6',
                      borderRadius: 10,
                      padding: '14px 20px',
                      border: '1px solid #ffd591',
                    }}
                  >
                    <div style={{ fontSize: 12, color: '#d46b08', marginBottom: 4 }}>
                      提前还款金额
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#d46b08' }}>
                      {formatMoney(payoffResult.payoffAmount)}
                      <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 2 }}>元</span>
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      minWidth: 180,
                      background: '#f6ffed',
                      borderRadius: 10,
                      padding: '14px 20px',
                      border: '1px solid #b7eb8f',
                    }}
                  >
                    <div style={{ fontSize: 12, color: '#389e0d', marginBottom: 4 }}>节省利息</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#389e0d' }}>
                      {formatMoney(payoffResult.savedInterest)}
                      <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 2 }}>元</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            {payoffResult && (
              <div
                style={{
                  marginTop: 16,
                  padding: '12px 16px',
                  background: '#e6f7ff',
                  borderRadius: 8,
                  border: '1px solid #91d5ff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <ThunderboltOutlined style={{ color: '#096dd9', marginTop: 2, flexShrink: 0 }} />
                  <Text style={{ fontSize: 13, color: '#0050b3', lineHeight: 1.8 }}>
                    如果在 <strong>{payoffDate}</strong> 提前还清，需一次性支付{' '}
                    <strong>{formatMoney(payoffResult.payoffAmount)}</strong> 元（含剩余本金{' '}
                    {formatMoney(payoffResult.remainingPrincipalAtPayoff)} 元 +
                    当期利息），预计可节省利息{' '}
                    <strong style={{ color: '#389e0d' }}>
                      {formatMoney(payoffResult.savedInterest)}
                    </strong>{' '}
                    元
                  </Text>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ minWidth: 200, maxWidth: 280 }}>
                <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>
                  输入提前还款金额
                </Text>
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={record.loanAmount}
                  step={10000}
                  precision={2}
                  placeholder="请输入金额"
                  value={inputAmount}
                  onChange={handleAmountChange}
                  addonAfter="元"
                />
                <div style={{ marginTop: 6, fontSize: 12, color: '#bfbfbf' }}>
                  当前剩余本金：{formatMoney(progress.remainingPrincipal)} 元
                </div>
              </div>
              {amountResult && (
                <>
                  <div
                    style={{
                      flex: 1,
                      minWidth: 180,
                      background: '#e6f4ff',
                      borderRadius: 10,
                      padding: '14px 20px',
                      border: '1px solid #91caff',
                    }}
                  >
                    <div style={{ fontSize: 12, color: '#0958d9', marginBottom: 4 }}>
                      预计还清日期
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#0958d9' }}>
                      {amountResult.payoffDate}
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      minWidth: 180,
                      background: '#f6ffed',
                      borderRadius: 10,
                      padding: '14px 20px',
                      border: '1px solid #b7eb8f',
                    }}
                  >
                    <div style={{ fontSize: 12, color: '#389e0d', marginBottom: 4 }}>节省利息</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#389e0d' }}>
                      {formatMoney(amountResult.savedInterest)}
                      <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 2 }}>元</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            {amountResult && (
              <div
                style={{
                  marginTop: 16,
                  padding: '12px 16px',
                  background: '#e6f7ff',
                  borderRadius: 8,
                  border: '1px solid #91d5ff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <ThunderboltOutlined style={{ color: '#096dd9', marginTop: 2, flexShrink: 0 }} />
                  <Text style={{ fontSize: 13, color: '#0050b3', lineHeight: 1.8 }}>
                    一次性支付 <strong>{formatMoney(inputAmount ?? 0)}</strong> 元，预计可在{' '}
                    <strong>{amountResult.payoffDate}</strong> 还清贷款，预计可节省利息{' '}
                    <strong style={{ color: '#389e0d' }}>
                      {formatMoney(amountResult.savedInterest)}
                    </strong>{' '}
                    元
                  </Text>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* 还款计划表格 */}
      <Card style={{ marginBottom: 16 }} styles={{ body: { padding: '20px 24px' } }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(114, 46, 209, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 10,
            }}
          >
            <WalletOutlined style={{ fontSize: 18, color: '#722ed1' }} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#1f1f1f' }}>还款计划</span>
          <Text type="secondary" style={{ fontSize: 13, marginLeft: 8 }}>
            共 {record.repayments.length} 期，点击「标记已还」记录还款状态
          </Text>
        </div>
        <LoanTrackerTable
          record={record}
          onMarkPaid={handleOpenConfirm}
          onMarkUnpaid={handleMarkUnpaid}
        />
      </Card>

      {/* 确认弹窗 */}
      <Modal
        title="确认还款"
        open={confirmModalOpen}
        onOk={handleConfirmPaid}
        onCancel={() => setConfirmModalOpen(false)}
        okText="确认已还"
        cancelText="取消"
        width={400}
      >
        <div style={{ padding: '8px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text type="secondary">期数</Text>
            <span style={{ fontWeight: 600 }}>第 {confirmPeriod} 期</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text type="secondary">应还日期</Text>
            <span style={{ fontWeight: 600 }}>
              {record.repayments.find(r => r.period === confirmPeriod)?.dueDate}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text type="secondary">月供金额</Text>
            <span style={{ fontWeight: 700, color: '#ff4d4f' }}>
              {formatMoney(confirmAmount)} 元
            </span>
          </div>
          <div
            style={{
              background: '#fffbe6',
              borderRadius: 8,
              padding: '10px 14px',
              border: '1px solid #ffe58f',
            }}
          >
            <Text type="warning" style={{ fontSize: 12 }}>
              标记后可在表格中取消标记
            </Text>
          </div>
        </div>
      </Modal>
    </div>
  )
}
