import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import type { FundHolding, FundHoldingMetrics, FundHoldingsMap, FundInfo } from '@/types'
import { idbGet, idbSet } from '@/utils/common/idb'
import { IDB_KEYS } from '@/constants'

dayjs.extend(utc)
dayjs.extend(timezone)

/** 读取全部基金持仓 */
export async function loadFundHoldings(): Promise<FundHoldingsMap> {
  const raw = await idbGet<FundHoldingsMap>(IDB_KEYS.FUND_HOLDINGS)
  return raw ?? {}
}

/** 保存单只基金持仓；份额或成本无效时删除该条 */
export async function saveFundHolding(
  fcode: string,
  holding: FundHolding | null
): Promise<FundHoldingsMap> {
  const map = await loadFundHoldings()
  if (holding && holding.shares > 0 && holding.costPrice > 0) {
    map[fcode] = holding
  } else {
    delete map[fcode]
  }
  await idbSet(IDB_KEYS.FUND_HOLDINGS, map)
  return map
}

/** 移除私有快照导入的持仓，保留用户手动录入 */
export function stripSnapshotHoldings(map: FundHoldingsMap, snapshotNote: string): FundHoldingsMap {
  const next: FundHoldingsMap = {}
  for (const [code, holding] of Object.entries(map)) {
    if (holding.note === snapshotNote) continue
    next[code] = holding
  }
  return next
}

/** 列表是否存在实时估值 */
export function fundsHaveRealtime(funds: FundInfo[]): boolean {
  return funds.some(f => f.GSZZL !== null && f.GSZZL !== undefined && f.GSZZL !== '')
}

/** 当前用于市值的净值（优先估算净值） */
export function getMarkPrice(fund: FundInfo): number {
  const gsz = Number(fund.GSZ)
  const nav = Number(fund.NAV)
  if (!Number.isNaN(gsz) && gsz > 0) return gsz
  if (!Number.isNaN(nav) && nav > 0) return nav
  return 0
}

/** 涨跌幅：有实时用估算，否则用昨日 */
export function getChangePct(fund: FundInfo, hasRealtime: boolean): number | null {
  const gszzl = Number(fund.GSZZL)
  const navchgrt = Number(fund.NAVCHGRT)
  if (hasRealtime && !Number.isNaN(gszzl)) return gszzl
  if (!Number.isNaN(navchgrt)) return navchgrt
  return null
}

/** 昨日涨跌幅 */
export function getYesterdayChangePct(fund: FundInfo): number | null {
  const navchgrt = Number(fund.NAVCHGRT)
  return Number.isNaN(navchgrt) ? null : navchgrt
}

/** 估算与昨日偏差（百分点） */
export function getEstimateDeviation(fund: FundInfo, hasRealtime: boolean): number | null {
  if (!hasRealtime) return null
  const est = getChangePct(fund, true)
  const yesterday = getYesterdayChangePct(fund)
  if (est === null || yesterday === null) return null
  return est - yesterday
}

/** 单只基金持仓指标 */
export function calcHoldingMetrics(
  fund: FundInfo,
  holding: FundHolding | undefined,
  hasRealtime: boolean
): FundHoldingMetrics | null {
  if (!holding || holding.shares <= 0 || holding.costPrice <= 0) return null

  const price = getMarkPrice(fund)
  const nav = Number(fund.NAV)
  const baseNav = !Number.isNaN(nav) && nav > 0 ? nav : price
  const marketValue = holding.shares * price
  const costValue = holding.shares * holding.costPrice
  const profit = marketValue - costValue
  const profitPct =
    holding.costPrice > 0 ? ((price - holding.costPrice) / holding.costPrice) * 100 : null
  const change = getChangePct(fund, hasRealtime)
  const todayProfit =
    change !== null && baseNav > 0 ? holding.shares * baseNav * (change / 100) : null

  return { marketValue, costValue, profit, profitPct, todayProfit }
}

export interface PortfolioSummary {
  hasRealtime: boolean
  hasHoldings: boolean
  totalMarketValue: number
  totalTodayProfit: number
  totalFloatingProfit: number
  weightedChange: number
  equalAvgChange: number
}

/** 组合汇总：有持仓时按市值加权，否则等权平均 */
export function calcPortfolioSummary(
  funds: FundInfo[],
  holdings: FundHoldingsMap
): PortfolioSummary {
  const hasRealtime = fundsHaveRealtime(funds)
  let totalMarketValue = 0
  let weightedSum = 0
  let totalTodayProfit = 0
  let totalFloatingProfit = 0
  let equalTotal = 0
  let equalCount = 0
  let hasHoldings = false

  funds.forEach(fund => {
    const change = getChangePct(fund, hasRealtime)
    if (change !== null) {
      equalTotal += change
      equalCount += 1
    }

    const metrics = calcHoldingMetrics(fund, holdings[fund.FCODE], hasRealtime)
    if (!metrics || change === null) return

    hasHoldings = true
    totalMarketValue += metrics.marketValue
    weightedSum += metrics.marketValue * change
    if (metrics.todayProfit !== null) totalTodayProfit += metrics.todayProfit
    totalFloatingProfit += metrics.profit
  })

  const equalAvgChange = equalCount > 0 ? equalTotal / equalCount : 0
  const weightedChange =
    hasHoldings && totalMarketValue > 0 ? weightedSum / totalMarketValue : equalAvgChange

  return {
    hasRealtime,
    hasHoldings,
    totalMarketValue,
    totalTodayProfit,
    totalFloatingProfit,
    weightedChange,
    equalAvgChange,
  }
}

/** 交易时段提示（A 股基金估值） */
export function getValuationSessionHint(): string | null {
  const now = dayjs().tz('Asia/Shanghai')
  const weekday = now.day()
  if (weekday === 0 || weekday === 6) {
    return '周末休市，估值可能不更新；最终以基金公司公布净值为准。'
  }

  const minutes = now.hour() * 60 + now.minute()
  const marketOpen = 9 * 60 + 30
  const marketClose = 15 * 60

  if (minutes < marketOpen) {
    return '盘前：估值可能尚未开始更新。'
  }
  if (minutes >= marketClose) {
    return '已收盘：估值已定格，最终以晚间公布净值为准。'
  }
  return null
}

/** 涨跌颜色 */
export function getChangeColor(value: number): string {
  if (value > 0) return '#f5222d'
  if (value < 0) return '#52c41a'
  return '#666'
}
