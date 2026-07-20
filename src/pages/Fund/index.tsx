import { useState, useCallback, useEffect, useRef, useMemo, lazy, Suspense } from 'react'
import { Card, Button, Typography, Space, message, Switch, Tooltip, Alert } from 'antd'

const { Text } = Typography
import { ReloadOutlined, SyncOutlined, BellOutlined, CopyOutlined } from '@ant-design/icons'
import ListPage from '@/components/ListPage'
import { fetchFundList } from '@/api/fund'
import {
  FundTable,
  FundSearch,
  StatisticsCards,
  FundDetailModal,
  FundHoldingDrawer,
} from './components'

const ChartModal = lazy(() => import('./components/ChartModal'))
import type { FundHolding, FundHoldingsMap, FundInfo } from '@/types'
import { REFRESH_INTERVAL, IDB_KEYS, STORAGE_KEYS } from '@/constants'
import {
  storage,
  loadFundHoldings,
  saveFundHolding,
  calcHoldingMetrics,
  calcPortfolioSummary,
  fundsHaveRealtime,
  getChangePct,
  getValuationSessionHint,
  idbSet,
  stripSnapshotHoldings,
} from '@/utils'
import {
  getPrivateFundBootstrap,
  resolveInitialFundCodes,
  FUND_PRIVATE_SNAPSHOT_NOTE,
} from './privateBootstrap'

const privateBootstrap = getPrivateFundBootstrap()

function FundMonitor() {
  const [fundCodes, setFundCodes] = useState<string[]>(() =>
    resolveInitialFundCodes(privateBootstrap)
  )

  const [funds, setFunds] = useState<FundInfo[]>([])
  const [holdings, setHoldings] = useState<FundHoldingsMap>({})
  const [loading, setLoading] = useState(false)

  const [autoRefresh, setAutoRefresh] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const [chartModalOpen, setChartModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [holdingDrawerOpen, setHoldingDrawerOpen] = useState(false)
  const [selectedFund, setSelectedFund] = useState<FundInfo | null>(null)

  const sessionHint = useMemo(() => getValuationSessionHint(), [])

  useEffect(() => {
    storage.set(STORAGE_KEYS.FUND_CODES, fundCodes)
  }, [fundCodes])

  const applyHoldings = useCallback(async (data: FundInfo[]) => {
    if (privateBootstrap) {
      const fromSnapshot = privateBootstrap.buildHoldingsFromFunds(data)
      const manual = await loadFundHoldings()
      const merged = { ...manual, ...fromSnapshot }
      setHoldings(merged)
      await idbSet(IDB_KEYS.FUND_HOLDINGS, merged)
      storage.set(STORAGE_KEYS.FUND_PRIVATE_BOOTSTRAP, true)
      return
    }

    let manual = await loadFundHoldings()
    manual = stripSnapshotHoldings(manual, FUND_PRIVATE_SNAPSHOT_NOTE)
    await idbSet(IDB_KEYS.FUND_HOLDINGS, manual)
    setHoldings(manual)
  }, [])

  const loadFundData = useCallback(async () => {
    if (fundCodes.length === 0) {
      setFunds([])
      return
    }

    setLoading(true)
    try {
      const data = await fetchFundList(fundCodes)
      setFunds(data)
      await applyHoldings(data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('获取基金数据失败:', error)
      message.error('获取基金数据失败，请检查网络')
    } finally {
      setLoading(false)
    }
  }, [fundCodes, applyHoldings])

  useEffect(() => {
    loadFundData()
  }, [loadFundData])

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
  }, [autoRefresh, loadFundData])

  const sortedFunds = useMemo(() => {
    const codeIndexMap = new Map(fundCodes.map((code, index) => [code, index]))
    return [...funds].sort((a, b) => {
      const indexA = codeIndexMap.get(a.FCODE) ?? Infinity
      const indexB = codeIndexMap.get(b.FCODE) ?? Infinity
      return indexA - indexB
    })
  }, [funds, fundCodes])

  const portfolio = useMemo(
    () => calcPortfolioSummary(sortedFunds, holdings),
    [sortedFunds, holdings]
  )

  const handleCopyPageData = useCallback(async () => {
    const hasRealtime = fundsHaveRealtime(sortedFunds)
    const lines: string[] = [
      '——— 基金实时监控 ———',
      lastUpdate ? `更新于 ${lastUpdate.toLocaleString('zh-CN')}` : '',
    ]

    if (portfolio.hasHoldings) {
      lines.push(
        `组合市值 ${portfolio.totalMarketValue.toFixed(2)} 元`,
        `今日估算盈亏 ${portfolio.totalTodayProfit >= 0 ? '+' : ''}${portfolio.totalTodayProfit.toFixed(2)} 元`,
        `加权涨跌 ${portfolio.weightedChange >= 0 ? '+' : ''}${portfolio.weightedChange.toFixed(2)}%`,
        ''
      )
    }

    sortedFunds.forEach(f => {
      const change = getChangePct(f, hasRealtime)
      const status =
        change === null
          ? '—'
          : change > 0
            ? `涨 +${change.toFixed(2)}%`
            : change < 0
              ? `跌 ${change.toFixed(2)}%`
              : '平'
      const metrics = calcHoldingMetrics(f, holdings[f.FCODE], hasRealtime)
      const holdingPart = metrics
        ? `  持仓盈亏 ${metrics.profit >= 0 ? '+' : ''}${metrics.profit.toFixed(2)}元`
        : ''
      lines.push(`${f.FCODE}  ${f.SHORTNAME}  ${status}${holdingPart}`)
    })

    const text = lines.join('\n')
    try {
      await navigator.clipboard.writeText(text)
      message.success('已复制到剪贴板')
    } catch {
      message.error('复制失败，请手动选择复制')
    }
  }, [sortedFunds, lastUpdate, holdings, portfolio])

  const handleViewChart = useCallback((fund: FundInfo) => {
    setSelectedFund(fund)
    setChartModalOpen(true)
  }, [])

  const handleViewDetail = useCallback((fund: FundInfo) => {
    setSelectedFund(fund)
    setDetailModalOpen(true)
  }, [])

  const handleEditHolding = useCallback((fund: FundInfo) => {
    setSelectedFund(fund)
    setHoldingDrawerOpen(true)
  }, [])

  const handleSaveHolding = useCallback(async (fcode: string, holding: FundHolding | null) => {
    const next = await saveFundHolding(fcode, holding)
    setHoldings(next)
    message.success(holding ? '持仓已保存' : '持仓已清除')
  }, [])

  const handleDelete = useCallback((fundCode: string) => {
    setFundCodes(prev => prev.filter(code => code !== fundCode))
    message.success('删除成功')
  }, [])

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
        description="实时追踪基金估值变化，支持持仓盈亏、组合汇总与图表分析"
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
        {privateBootstrap && (
          <Alert
            className="mb-4"
            type="success"
            showIcon
            closable
            message="已加载本机支付宝持仓快照"
            description="基金顺序与份额/成本来自 src/private/fund-portfolio/data.ts（仅本机，不提交 Git）。刷新后会按截图市值重新推算持仓。"
          />
        )}
        {sessionHint && (
          <Alert className="mb-4" type="info" showIcon message={sessionHint} closable />
        )}

        <FundSearch
          fundCodes={fundCodes}
          funds={funds}
          onFundCodesChange={setFundCodes}
          onRefresh={loadFundData}
          loading={loading}
        />

        <StatisticsCards funds={funds} holdings={holdings} />

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
            holdings={holdings}
            onViewDetail={handleViewDetail}
            onViewChart={handleViewChart}
            onEditHolding={handleEditHolding}
            onDelete={handleDelete}
            onReorder={handleReorder}
          />
        </Card>
      </ListPage>

      {chartModalOpen && (
        <Suspense fallback={null}>
          <ChartModal
            open={chartModalOpen}
            fund={selectedFund}
            onClose={() => setChartModalOpen(false)}
          />
        </Suspense>
      )}

      <FundDetailModal
        open={detailModalOpen}
        fund={selectedFund}
        onClose={() => setDetailModalOpen(false)}
      />

      <FundHoldingDrawer
        open={holdingDrawerOpen}
        fund={selectedFund}
        holding={selectedFund ? (holdings[selectedFund.FCODE] ?? null) : null}
        onClose={() => setHoldingDrawerOpen(false)}
        onSave={handleSaveHolding}
      />
    </>
  )
}

export default FundMonitor
