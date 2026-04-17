import { DATA_CENTER_URL } from '@/constants'

/**
 * 获取某个地区的利率是否需要地址？
 * 需要。实际房贷利率 = LPR（全国统一）+ 加点，加点是按地区、银行不同的，
 * 所以若要查「某地区」的执行利率，必须传该地区（省/市/区）。
 * 当前商贷接口仅取全国 LPR；若后续接入按城市查执行利率的 API，则必须传地址。
 */

/**
 * 从东方财富数据中心获取最新 LPR（5 年期），用作商贷参考利率
 * 接口可能随东方财富改版失效，失败时返回 null，前端使用默认 3.05
 */
export async function fetchLatestLPR(): Promise<number | null> {
  try {
    const url = `${DATA_CENTER_URL}/api/data/v1/get?reportName=RPTA_APP_LPR&columns=TRADE_DATE,LPR1Y,LPR5Y&pageNumber=1&pageSize=1&sortColumns=TRADE_DATE&sortTypes=-1`
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()
    const list = data?.result?.data
    if (Array.isArray(list) && list.length > 0 && list[0].LPR5Y != null) {
      const rate = Number(list[0].LPR5Y)
      return Number.isFinite(rate) ? rate : null
    }
    return null
  } catch {
    return null
  }
}

/**
 * 根据贷款类型与城市获取参考年利率（%）
 * 商贷：尝试拉取 LPR 5 年期，失败则返回默认 3.05
 * 公积金：暂无公开按城市接口，返回默认 2.6
 */
export async function fetchMortgageRate(
  _city: string,
  loanType: 'commercial' | 'provident'
): Promise<number | null> {
  if (loanType === 'provident') {
    return null
  }
  return fetchLatestLPR()
}
