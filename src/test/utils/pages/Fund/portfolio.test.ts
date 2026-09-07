import { describe, expect, it } from 'vitest'
import {
  calcHoldingMetrics,
  calcPortfolioSummary,
  fundsHaveRealtime,
  getChangeColor,
  getChangePct,
  getEstimateDeviation,
  getMarkPrice,
  getYesterdayChangePct,
  stripSnapshotHoldings,
} from '@/utils/pages/Fund/portfolio'
import type { FundHolding, FundInfo } from '@/types'

function fund(partial: Partial<FundInfo> & Pick<FundInfo, 'FCODE'>): FundInfo {
  return {
    SHORTNAME: '测试基金',
    NAV: '1.0000',
    NAVCHGRT: '0',
    GSZ: '',
    GSZZL: '',
    ...partial,
  } as FundInfo
}

describe('Fund portfolio 纯函数', () => {
  it('stripSnapshotHoldings 去掉快照备注持仓', () => {
    const map = {
      a: { shares: 100, costPrice: 1, note: 'snapshot' } as FundHolding,
      b: { shares: 50, costPrice: 2, note: '手动' } as FundHolding,
    }
    expect(stripSnapshotHoldings(map, 'snapshot')).toEqual({
      b: map.b,
    })
  })

  it('fundsHaveRealtime / getMarkPrice / getChangePct', () => {
    const list = [
      fund({ FCODE: '1', GSZZL: '1.2', GSZ: '1.05', NAV: '1.00', NAVCHGRT: '0.5' }),
      fund({ FCODE: '2', GSZZL: '', NAVCHGRT: '-0.3' }),
    ]
    expect(fundsHaveRealtime(list)).toBe(true)
    expect(getMarkPrice(list[0]!)).toBe(1.05)
    expect(getChangePct(list[0]!, true)).toBe(1.2)
    expect(getChangePct(list[1]!, false)).toBe(-0.3)
    expect(getYesterdayChangePct(list[0]!)).toBe(0.5)
  })

  it('getEstimateDeviation 在有实时时返回估算减昨日', () => {
    const f = fund({ FCODE: '1', GSZZL: '1.5', NAVCHGRT: '0.5' })
    expect(getEstimateDeviation(f, true)).toBeCloseTo(1)
    expect(getEstimateDeviation(f, false)).toBeNull()
  })

  it('calcHoldingMetrics 计算市值与盈亏', () => {
    const f = fund({ FCODE: '1', GSZ: '2', NAV: '1.8', GSZZL: '1', NAVCHGRT: '0.5' })
    const holding: FundHolding = { shares: 100, costPrice: 1.5 }
    const m = calcHoldingMetrics(f, holding, true)
    expect(m).not.toBeNull()
    expect(m!.marketValue).toBeCloseTo(200)
    expect(m!.costValue).toBeCloseTo(150)
    expect(m!.profit).toBeCloseTo(50)
    expect(m!.profitPct).toBeCloseTo(((2 - 1.5) / 1.5) * 100)
  })

  it('无有效持仓时 metrics 为 null', () => {
    const f = fund({ FCODE: '1', NAV: '1' })
    expect(calcHoldingMetrics(f, undefined, false)).toBeNull()
    expect(calcHoldingMetrics(f, { shares: 0, costPrice: 1 }, false)).toBeNull()
  })

  it('calcPortfolioSummary 按市值加权', () => {
    const funds = [
      fund({ FCODE: 'a', GSZ: '2', GSZZL: '2', NAV: '2', NAVCHGRT: '1' }),
      fund({ FCODE: 'b', GSZ: '1', GSZZL: '-1', NAV: '1', NAVCHGRT: '0' }),
    ]
    const holdings = {
      a: { shares: 100, costPrice: 1 } as FundHolding,
      b: { shares: 100, costPrice: 1 } as FundHolding,
    }
    const s = calcPortfolioSummary(funds, holdings)
    expect(s.hasHoldings).toBe(true)
    expect(s.totalMarketValue).toBeCloseTo(300)
    // 加权：(200*2 + 100*(-1)) / 300 = 1
    expect(s.weightedChange).toBeCloseTo(1)
  })

  it('getChangeColor 涨红跌绿', () => {
    expect(getChangeColor(1)).toBe('#f5222d')
    expect(getChangeColor(-1)).toBe('#52c41a')
    expect(getChangeColor(0)).toBe('#666')
  })
})
