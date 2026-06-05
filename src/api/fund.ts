import type {
  FundInfo,
  FundDetailInfo,
  YieldData,
  NetValueData,
  NetWorthTrendPoint,
  PingzhongResponse,
  FundStock,
  FundManager,
  TimeRange,
  RealtimeValuationResponse,
  FundSearchResult,
} from '@/types'
import {
  FUND_API_URL,
  FUND_REALTIME_URL,
  FUND_SUGGEST_URL,
  FUND_DATA_URL,
  COMMON_WAP_PARAMS,
} from '@/constants'

/** pingzhongdata.js 注入的全局变量名（用完即清理，避免污染下次加载） */
const PINGZHONG_GLOBALS = [
  'Data_netWorthTrend',
  'Data_ACWorthTrend',
  'Data_assetAllocation',
  'Data_buySedemption',
  'Data_currentFundManager',
  'Data_fluctuationScale',
  'Data_fundSharesPositions',
  'Data_grandTotal',
  'Data_holderStructure',
  'Data_performanceEvaluation',
  'Data_rateInSimilarPersent',
  'Data_rateInSimilarType',
  'Data_gzTrend',
  'fS_name',
  'fS_code',
  'fund_minsg',
  'fund_Rate',
  'fund_sourceRate',
  'ishb',
  'stockCodes',
  'stockCodesNew',
  'swithSameType',
  'syl_1n',
  'syl_1y',
  'syl_3y',
  'syl_6y',
  'zqCodes',
  'zqCodesNew',
] as const

declare global {
  interface Window {
    /** 天天基金 js 接口回调 */
    jsonpgz?: (data: RealtimeValuationResponse) => void
  }
}

/**
 * 构建URL参数
 */
function buildParams(params: Record<string, string | number>): string {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

/**
 * 通过 script 加载的接口与全局回调/变量会冲突，必须串行执行
 */
let scriptTaskChain: Promise<void> = Promise.resolve()

function runScriptTask<T>(task: () => Promise<T>): Promise<T> {
  const next = scriptTaskChain.then(task)
  scriptTaskChain = next.then(
    () => {},
    () => {}
  )
  return next
}

const JSONP_TIMEOUT_MS = 20_000

/**
 * fundmobapi 各 ashx 接口支持 callback JSONP，线上静态页无法使用 fetch（无 CORS）
 */
function fetchFundMobApiJsonp<T>(pathWithQuery: string): Promise<T | null> {
  const path = pathWithQuery.startsWith('/') ? pathWithQuery : `/${pathWithQuery}`
  return runScriptTask(
    () =>
      new Promise(resolve => {
        const cbName = `__emFundMob_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
        const script = document.createElement('script')
        let settled = false

        const finish = (payload: T | null) => {
          if (settled) return
          settled = true
          window.clearTimeout(timer)
          Reflect.deleteProperty(window, cbName as keyof Window & string)
          script.remove()
          resolve(payload)
        }

        const timer = window.setTimeout(() => finish(null), JSONP_TIMEOUT_MS)

        ;(window as unknown as Record<string, (data: T) => void>)[cbName] = (data: T) => {
          finish(data)
        }

        script.onerror = () => finish(null)
        const sep = path.includes('?') ? '&' : '?'
        script.src = `${FUND_API_URL}${path}${sep}callback=${encodeURIComponent(cbName)}`
        document.head.appendChild(script)
      })
  )
}

/**
 * 获取单个基金的实时估值数据（JSONP：script 加载，避免生产环境 fetch 被 CORS 拦截）
 * 接口: https://fundgz.1234567.com.cn/js/{基金代码}.js
 */
function fetchRealtimeValuation(fcode: string): Promise<RealtimeValuationResponse | null> {
  return runScriptTask(
    () =>
      new Promise(resolve => {
        const url = `${FUND_REALTIME_URL}/js/${fcode}.js?rt=${Date.now()}`
        const script = document.createElement('script')
        let settled = false
        const prevCallback = window.jsonpgz

        const finish = (value: RealtimeValuationResponse | null) => {
          if (settled) return
          settled = true
          window.clearTimeout(timer)
          window.jsonpgz = prevCallback
          script.remove()
          resolve(value)
        }

        const timer = window.setTimeout(() => finish(null), JSONP_TIMEOUT_MS)

        window.jsonpgz = (data: RealtimeValuationResponse) => {
          finish(data)
        }

        script.onerror = () => finish(null)
        script.src = url
        document.head.appendChild(script)
      })
  )
}

/**
 * 获取基金基本信息列表（包含实时估值）
 * 使用天天基金实时估值 API，获取当日估值数据
 */
export async function fetchFundList(fcodes: string[]): Promise<FundInfo[]> {
  // 并行请求所有基金的实时估值数据
  const promises = fcodes.map(fcode => fetchRealtimeValuation(fcode))
  const results = await Promise.all(promises)

  // 转换为 FundInfo 格式
  return results
    .filter((item): item is RealtimeValuationResponse => item !== null)
    .map(item => ({
      FCODE: item.fundcode,
      SHORTNAME: item.name,
      PDATE: item.jzrq,
      NAV: item.dwjz,
      ACCNAV: item.dwjz, // 实时接口不提供累计净值，使用单位净值代替
      NAVCHGRT: '', // 实时接口不提供昨日涨跌幅，留空
      GSZ: item.gsz,
      GSZZL: item.gszzl,
      GZTIME: item.gztime,
    }))
}

/**
 * 加载 pingzhongdata.js，提取 Data_netWorthTrend 等可用数据。
 * 这是当前最可靠的数据源，返回净值走势、累计收益率等信息。
 *
 * @param fcode 基金代码
 * @returns 包含净值走势数据的 PingzhongResponse
 */
export function fetchPingzhongNetWorth(fcode: string): Promise<PingzhongResponse> {
  return runScriptTask(async () => {
    const url = `${FUND_DATA_URL}/pingzhongdata/${fcode}.js?v=${Date.now()}`
    const script = document.createElement('script')
    try {
      await new Promise<void>((resolve, reject) => {
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('script load failed'))
        script.src = url
        document.head.appendChild(script)
      })

      const raw: NetWorthTrendPoint[] | undefined = (
        window as unknown as Record<string, NetWorthTrendPoint[] | undefined>
      ).Data_netWorthTrend

      return {
        netWorthTrend: Array.isArray(raw) ? raw : [],
        fundName: (window as unknown as Record<string, string>).fS_name || '',
        fundCode: (window as unknown as Record<string, string>).fS_code || '',
      }
    } catch (error) {
      console.error('加载基金净值数据失败:', error)
      return { netWorthTrend: [], fundName: '', fundCode: '' }
    } finally {
      script.remove()
      // 用完即清理全局变量，避免污染后续加载
      PINGZHONG_GLOBALS.forEach(key => {
        delete (window as unknown as Record<string, unknown>)[key]
      })
    }
  })
}

/**
 * 获取基金收益率图表数据
 */
export async function fetchYieldData(
  fcode: string,
  range: TimeRange = 'n'
): Promise<{ data: YieldData[]; indexName: string }> {
  const params = buildParams({
    ...COMMON_WAP_PARAMS,
    FCODE: fcode,
    RANGE: range,
    _: Date.now(),
  })

  const data = await fetchFundMobApiJsonp<{
    Datas?: YieldData[]
    Expansion?: { INDEXNAME?: string }
  }>(`/FundMApi/FundYieldDiagramNew.ashx?${params}`)

  return {
    data: data?.Datas || [],
    indexName: data?.Expansion?.INDEXNAME || '基准指数',
  }
}

/**
 * 获取基金净值图表数据
 */
export async function fetchNetValueData(
  fcode: string,
  range: TimeRange = 'n'
): Promise<NetValueData[]> {
  const params = buildParams({
    ...COMMON_WAP_PARAMS,
    FCODE: fcode,
    RANGE: range,
    _: Date.now(),
  })

  const data = await fetchFundMobApiJsonp<{ Datas?: NetValueData[] }>(
    `/FundMApi/FundNetDiagram.ashx?${params}`
  )
  return data?.Datas || []
}

/**
 * 获取基金详细信息
 */
export async function fetchFundDetail(fcode: string): Promise<FundDetailInfo | null> {
  const params = buildParams({
    ...COMMON_WAP_PARAMS,
    FCODE: fcode,
    _: Date.now(),
  })

  const data = await fetchFundMobApiJsonp<{ Datas?: FundDetailInfo | null }>(
    `/FundMApi/FundBaseTypeInformation.ashx?${params}`
  )
  return data?.Datas ?? null
}

/**
 * 获取基金持仓信息
 */
export async function fetchFundPosition(
  fcode: string
): Promise<{ stocks: FundStock[]; date: string }> {
  const params = buildParams({
    ...COMMON_WAP_PARAMS,
    FCODE: fcode,
    _: Date.now(),
  })

  const data = await fetchFundMobApiJsonp<{
    Datas?: { fundStocks?: FundStock[] }
    Expansion?: string
  }>(`/FundMNewApi/FundMNInverstPosition?${params}`)

  return {
    stocks: data?.Datas?.fundStocks || [],
    date: data?.Expansion || '',
  }
}

/**
 * 获取基金经理列表
 */
export async function fetchManagerList(fcode: string): Promise<FundManager[]> {
  const params = buildParams({
    ...COMMON_WAP_PARAMS,
    FCODE: fcode,
    _: Date.now(),
  })

  const data = await fetchFundMobApiJsonp<{ Datas?: FundManager[] }>(
    `/FundMApi/FundManagerList.ashx?${params}`
  )
  return data?.Datas || []
}

/**
 * 获取基金经理详情
 */
export async function fetchManagerDetail(fcode: string): Promise<FundManager[]> {
  const params = buildParams({
    ...COMMON_WAP_PARAMS,
    FCODE: fcode,
    _: Date.now(),
  })

  const data = await fetchFundMobApiJsonp<{ Datas?: FundManager[] }>(
    `/FundMApi/FundMangerDetail.ashx?${params}`
  )
  return data?.Datas || []
}

/**
 * 搜索基金（用于联想输入）
 * JSONP：FundSearchAPI 无 CORS，生产环境 fetch 会被浏览器拦截（如 GitHub Pages）
 * @param keyword 搜索关键词（支持代码、名称、拼音）
 */
export function searchFund(keyword: string): Promise<FundSearchResult[]> {
  if (!keyword.trim()) return Promise.resolve([])

  const params = buildParams({
    m: 1, // 搜索基金
    key: keyword,
    _: Date.now(),
  })

  return runScriptTask(
    () =>
      new Promise(resolve => {
        const cbName = `__emFundSearch_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
        const script = document.createElement('script')
        let settled = false

        const finish = (rows: FundSearchResult[]) => {
          if (settled) return
          settled = true
          window.clearTimeout(timer)
          Reflect.deleteProperty(window, cbName as keyof Window & string)
          script.remove()
          resolve(rows)
        }

        const timer = window.setTimeout(() => finish([]), JSONP_TIMEOUT_MS)

        ;(window as unknown as Record<string, (payload: { Datas?: FundSearchResult[] }) => void>)[
          cbName
        ] = payload => {
          finish(payload?.Datas || [])
        }

        script.onerror = () => finish([])
        script.src = `${FUND_SUGGEST_URL}/FundSearch/api/FundSearchAPI.ashx?${params}&callback=${encodeURIComponent(cbName)}`
        document.head.appendChild(script)
      })
  )
}
