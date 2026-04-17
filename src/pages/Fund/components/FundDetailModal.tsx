import { useState, useEffect, useCallback } from 'react'
import { Descriptions, Spin, Tag, Tabs, Table, Progress, Empty, message } from 'antd'
import AppModal from '@/components/AppModal'
import { RiseOutlined, FallOutlined } from '@ant-design/icons'
import { fetchFundDetail, fetchFundPosition, fetchManagerDetail } from '@/api/fund'
import type { FundDetailInfo, FundStock, FundManager, FundDetailModalProps } from '@/types'

function FundDetailModal({ open, fund, onClose }: FundDetailModalProps) {
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<FundDetailInfo | null>(null)
  const [positions, setPositions] = useState<{ stocks: FundStock[]; date: string } | null>(null)
  const [managers, setManagers] = useState<FundManager[]>([])

  const loadData = useCallback(async (fcode: string) => {
    setLoading(true)
    try {
      const [detailData, positionData, managerData] = await Promise.all([
        fetchFundDetail(fcode),
        fetchFundPosition(fcode),
        fetchManagerDetail(fcode),
      ])
      setDetail(detailData)
      setPositions(positionData)
      setManagers(managerData)
    } catch (error) {
      console.error('获取基金详情失败:', error)
      message.error('获取基金详情失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open && fund) {
      loadData(fund.FCODE)
    }
  }, [open, fund, loadData])

  const renderValue = (value: string | undefined, suffix = '') => {
    if (!value) return '--'
    const num = Number(value)
    if (isNaN(num)) return value
    const isPositive = num > 0
    const color = isPositive ? '#f5222d' : num < 0 ? '#52c41a' : '#666'
    return (
      <span style={{ color }}>
        {isPositive ? '+' : ''}
        {num.toFixed(2)}
        {suffix}
      </span>
    )
  }

  const positionColumns = [
    {
      title: '股票名称',
      dataIndex: 'GPJC',
      key: 'GPJC',
      width: 120,
    },
    {
      title: '股票代码',
      dataIndex: 'GPDM',
      key: 'GPDM',
      width: 100,
      render: (code: string) => <span className="font-mono text-xs">{code}</span>,
    },
    {
      title: '持仓占比',
      dataIndex: 'JZBL',
      key: 'JZBL',
      width: 150,
      render: (value: string) => {
        const num = Number(value || 0)
        return (
          <div className="flex items-center gap-2">
            <Progress percent={num} size="small" className="w-20" showInfo={false} />
            <span>{num.toFixed(2)}%</span>
          </div>
        )
      },
    },
    {
      title: '较上期变动',
      dataIndex: 'PCTNVCHG',
      key: 'PCTNVCHG',
      width: 120,
      render: (value: string, record: FundStock) => {
        if (!value || value === '--') return '--'
        const num = Number(value)
        const isNew = record.PCTNVCHGTYPE === '新增'
        if (isNew) return <Tag color="blue">新进</Tag>
        const isIncrease = num > 0
        return (
          <span style={{ color: isIncrease ? '#f5222d' : '#52c41a' }}>
            {isIncrease ? <RiseOutlined /> : <FallOutlined />}
            {Math.abs(num).toFixed(2)}%
          </span>
        )
      },
    },
  ]

  const tabItems = [
    {
      key: 'basic',
      label: '基本信息',
      children: loading ? (
        <div className="py-10 text-center">
          <Spin />
        </div>
      ) : detail ? (
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="基金代码">{detail.FCODE}</Descriptions.Item>
          <Descriptions.Item label="基金类型">{detail.FTYPE || '--'}</Descriptions.Item>
          <Descriptions.Item label="基金公司">{detail.JJGS || '--'}</Descriptions.Item>
          <Descriptions.Item label="基金经理">{detail.JJJL || '--'}</Descriptions.Item>
          <Descriptions.Item label="成立日期">{detail.FSRQ || '--'}</Descriptions.Item>
          <Descriptions.Item label="基金规模">
            {detail.ENDNAV ? `${detail.ENDNAV}亿` : '--'}
          </Descriptions.Item>
          <Descriptions.Item label="单位净值">{detail.DWJZ || '--'}</Descriptions.Item>
          <Descriptions.Item label="累计净值">{detail.LJJZ || '--'}</Descriptions.Item>
          <Descriptions.Item label="申购状态">
            <Tag color={detail.SGZT === '开放申购' ? 'green' : 'red'}>{detail.SGZT || '--'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="赎回状态">
            <Tag color={detail.SHZT === '开放赎回' ? 'green' : 'red'}>{detail.SHZT || '--'}</Tag>
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <Empty description="暂无数据" />
      ),
    },
    {
      key: 'yield',
      label: '收益率',
      children: loading ? (
        <div className="py-10 text-center">
          <Spin />
        </div>
      ) : detail ? (
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="近1月收益">{renderValue(detail.SYL_Y, '%')}</Descriptions.Item>
          <Descriptions.Item label="近1月排名">{detail.RANKM || '--'}</Descriptions.Item>
          <Descriptions.Item label="近3月收益">{renderValue(detail.SYL_3Y, '%')}</Descriptions.Item>
          <Descriptions.Item label="近3月排名">{detail.RANKQ || '--'}</Descriptions.Item>
          <Descriptions.Item label="近6月收益">{renderValue(detail.SYL_6Y, '%')}</Descriptions.Item>
          <Descriptions.Item label="近6月排名">{detail.RANKHY || '--'}</Descriptions.Item>
          <Descriptions.Item label="近1年收益">{renderValue(detail.SYL_1N, '%')}</Descriptions.Item>
          <Descriptions.Item label="近1年排名">{detail.RANKY || '--'}</Descriptions.Item>
        </Descriptions>
      ) : (
        <Empty description="暂无数据" />
      ),
    },
    {
      key: 'position',
      label: '持仓明细',
      children: loading ? (
        <div className="py-10 text-center">
          <Spin />
        </div>
      ) : positions && positions.stocks.length > 0 ? (
        <div>
          <div className="mb-2 text-gray-500 text-xs">截止日期：{positions.date || '--'}</div>
          <Table
            dataSource={positions.stocks}
            columns={positionColumns}
            rowKey="GPDM"
            size="small"
            pagination={false}
          />
        </div>
      ) : (
        <Empty description="暂无持仓数据" />
      ),
    },
    {
      key: 'manager',
      label: '基金经理',
      children: loading ? (
        <div className="py-10 text-center">
          <Spin />
        </div>
      ) : managers.length > 0 ? (
        <div className="space-y-4">
          {managers.map(manager => (
            <div key={manager.MGRID} className="border rounded p-4">
              <div className="flex items-start gap-4">
                {manager.PHOTOURL && (
                  <img
                    src={manager.PHOTOURL}
                    alt={manager.MGRNAME}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="font-semibold text-lg mb-2">{manager.MGRNAME}</div>
                  <div className="text-gray-500 text-sm mb-2">
                    任职日期：{manager.FEMPDATE || '--'} | 任职 {manager.DAYS || '--'} 天
                  </div>
                  {manager.RESUME && <div className="text-gray-600 text-sm">{manager.RESUME}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Empty description="暂无基金经理信息" />
      ),
    },
  ]
  return (
    <AppModal
      title={
        <span>
          <span className="text-blue-600 font-mono mr-2">{fund?.FCODE}</span>
          {fund?.SHORTNAME} - 详情
        </span>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      destroyOnHidden
    >
      <Tabs items={tabItems} />
    </AppModal>
  )
}

export default FundDetailModal
