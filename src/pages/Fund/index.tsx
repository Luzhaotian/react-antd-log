import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { Card, Button, Typography, Space, message, Switch, Tooltip } from 'antd'

const { Text } = Typography
import { ReloadOutlined, SyncOutlined, BellOutlined, CopyOutlined } from '@ant-design/icons'
import ListPage from '@/components/ListPage'
import { fetchFundList } from '@/api/fund'
import { FundTable, FundSearch, StatisticsCards, ChartModal, FundDetailModal } from './components'
import type { FundInfo } from '@/types'
import { DEFAULT_FUND_CODES, REFRESH_INTERVAL } from '@/constants'
import { storage } from '@/utils'
import { STORAGE_KEYS } from '@/constants'

function FundMonitor() {
  // 基金代码列表
  const [fundCodes, setFundCodes] = useState<string[]>(() => {
    return storage.get<string[]>(STORAGE_KEYS.FUND_CODES) ?? DEFAULT_FUND_CODES
  })

  // 基金数据
  const [funds, setFunds] = useState<FundInfo[]>([])
  const [loading, setLoading] = useState(false)

  // 自动刷新
  const [autoRefresh, setAutoRefresh] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 上次更新时间
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // 弹窗状态
  const [chartModalOpen, setChartModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedFund, setSelectedFund] = useState<FundInfo | null>(null)

  // 保存基金代码到本地存储
  useEffect(() => {
    storage.set(STORAGE_KEYS.FUND_CODES, fundCodes)
  }, [fundCodes])

  // 获取基金数据
  const loadFundData = useCallback(async () => {
    if (fundCodes.length === 0) {
      setFunds([])
      return
    }

    setLoading(true)
    try {
      const data = await fetchFundList(fundCodes)
      setFunds(data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('获取基金数据失败:', error)
      message.error('获取基金数据失败，请检查网络')
    } finally {
      setLoading(false)
    }
  }, [fundCodes])

  // 初始加载
  useEffect(() => {
    loadFundData()
  }, [loadFundData])

  // 自动刷新逻辑
  useEffect(() => {
    if (autoRefresh) {
      timerRef.current = setInterval(() => {
        loadFundData()
      }, REFRESH_INTERVAL * 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [autoRefresh, REFRESH_INTERVAL, loadFundData])

  // 按 fundCodes 顺序排序 funds
  const sortedFunds = useMemo(() => {
    const codeIndexMap = new Map(fundCodes.map((code, index) => [code, index]))
    return [...funds].sort((a, b) => {
      const indexA = codeIndexMap.get(a.FCODE) ?? Infinity
      const indexB = codeIndexMap.get(b.FCODE) ?? Infinity
      return indexA - indexB
    })
  }, [funds, fundCodes])

  // 复制页面数据为文本：基金代码、名字、涨/跌，格式清晰
  const handleCopyPageData = useCallback(async () => {
    const lines: string[] = [
      '——— 基金实时监控 ———',
      lastUpdate ? `更新于 ${lastUpdate.toLocaleString('zh-CN')}` : '',
      '',
    ]

    sortedFunds.forEach(f => {
      const gszzl = f.GSZZL ? Number(f.GSZZL) : NaN
      const navchgrt = f.NAVCHGRT ? Number(f.NAVCHGRT) : NaN
      const change = !isNaN(gszzl) ? gszzl : !isNaN(navchgrt) ? navchgrt : null
      const status =
        change === null
          ? '—'
          : change > 0
            ? `涨 +${change.toFixed(2)}%`
            : change < 0
              ? `跌 ${change.toFixed(2)}%`
              : '平'
      lines.push(`${f.FCODE}  ${f.SHORTNAME}  ${status}`)
    })

    const text = lines.join('\n')
    try {
      await navigator.clipboard.writeText(text)
      message.success('已复制到剪贴板')
    } catch {
      message.error('复制失败，请手动选择复制')
    }
  }, [sortedFunds, lastUpdate])

  // 打开图表弹窗
  const handleViewChart = useCallback((fund: FundInfo) => {
    setSelectedFund(fund)
    setChartModalOpen(true)
  }, [])

  // 打开详情弹窗
  const handleViewDetail = useCallback((fund: FundInfo) => {
    setSelectedFund(fund)
    setDetailModalOpen(true)
  }, [])

  // 删除基金
  const handleDelete = useCallback((fundCode: string) => {
    setFundCodes(prev => prev.filter(code => code !== fundCode))
    message.success('删除成功')
  }, [])

  // 拖拽排序
  const handleReorder = useCallback((newOrder: string[]) => {
    setFundCodes(newOrder)
  }, [])

  return (
    <>
      <ListPage
        title={
          <>
            <BellOutlined className="mr-2 text-blue-500" />
            基金实时监控
          </>
        }
        description="实时追踪基金估值变化，支持图表分析和详情查看"
        titleRight={
          <Space>
            <Tooltip title={`每 ${REFRESH_INTERVAL} 秒自动刷新`}>
              <span className="flex items-center gap-2">
                <SyncOutlined spin={autoRefresh} />
                <Switch
                  checked={autoRefresh}
                  onChange={setAutoRefresh}
                  checkedChildren="自动"
                  unCheckedChildren="手动"
                />
              </span>
            </Tooltip>
            <Button
              icon={<CopyOutlined />}
              onClick={handleCopyPageData}
              disabled={sortedFunds.length === 0}
            >
              复制页面数据
            </Button>
            <Button
              type="primary"
              icon={<ReloadOutlined spin={loading} />}
              onClick={loadFundData}
              loading={loading}
            >
              刷新
            </Button>
          </Space>
        }
      >
        <FundSearch
          fundCodes={fundCodes}
          funds={funds}
          onFundCodesChange={setFundCodes}
          onRefresh={loadFundData}
          loading={loading}
        />

        {/* 统计卡片 */}
        <StatisticsCards funds={funds} />

        {/* 基金列表 */}
        <Card
          title={
            <span className="flex items-center gap-2">
              基金列表
              {lastUpdate && (
                <Text type="secondary" className="text-xs font-normal">
                  更新于 {lastUpdate.toLocaleTimeString()}
                </Text>
              )}
            </span>
          }
          size="small"
        >
          <FundTable
            dataSource={sortedFunds}
            loading={loading}
            onViewDetail={handleViewDetail}
            onViewChart={handleViewChart}
            onDelete={handleDelete}
            onReorder={handleReorder}
          />
        </Card>
      </ListPage>

      <ChartModal
        open={chartModalOpen}
        fund={selectedFund}
        onClose={() => setChartModalOpen(false)}
      />

      <FundDetailModal
        open={detailModalOpen}
        fund={selectedFund}
        onClose={() => setDetailModalOpen(false)}
      />
    </>
  )
}

export default FundMonitor
