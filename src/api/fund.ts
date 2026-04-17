import type {
  FundInfo,
  FundDetailInfo,
  ValuationData,
  YieldData,
  NetValueData,
  FundStock,
  FundManager,
  TimeRange,
  RealtimeValuationResponse,
  FundSearchResult,
  GzTrendPoint,
} from '@/types'
import {
  FUND_API_URL,
  FUND_REALTIME_URL,
  FUND_SUGGEST_URL,
  FUND_DATA_URL,
  COMMON_WAP_PARAMS,
} from '@/constants'

/**
 * 构建URL参数
 */
function buildParams(params: Record<string, string | number>): string {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

/**
 * 解析 JSONP 响应
 */
function parseJsonp<T>(jsonpStr: string): T | null {
  // 匹配 jsonpgz({...}) 格式
  const match = jsonpStr.match(/jsonpgz\((.*)\);?/)
  if (match && match[1]) {
    try {
      return JSON.parse(match[1])
    } catch {
      return null
    }
  }
  return null
}

/**
 * 获取单个基金的实时估值数据
 * 使用天天基金实时估值接口: https://fundgz.1234567.com.cn/js/{基金代码}.js
 */
async function fetchRealtimeValuation(fcode: string): Promise<RealtimeValuationResponse | null> {
  try {
    const response = await fetch(`${FUND_REALTIME_URL}/js/${fcode}.js?rt=${Date.now()}`, {
      cache: 'no-store',
    })
    const text = await response.text()
    return parseJsonp<RealtimeValuationResponse>(text)
  } catch {
    return null
  }
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
 * 获取基金估值详情（用于估值图表）
 * 注意：非指数类基金可能返回空数据（官方限制）
 */
export async function fetchValuationDetail(fcode: string): Promise<ValuationData[]> {
  const params = buildParams({
    ...COMMON_WAP_PARAMS,
    FCODE: fcode,
    _: Date.now(),
  })

  const response = await fetch(
    `${FUND_API_URL}/FundMApi/FundVarietieValuationDetail.ashx?${params}`
  )
  const data = await response.json()

  // 解析字符串数组数据
  if (data.Datas && Array.isArray(data.Datas)) {
    return data.Datas.map((item: string) => {
      const parts = item.split(',')
      return {
        date: parts[0] || '',
        time: parts[1] || '',
        value: parts[2] || '',
      }
    })
  }
  return []
}

/**
 * 解析 pingzhongdata JS 文件内容
 * 提取 Data_gzTrend 等变量
 */
function parsePingzhongData(jsContent: string): {
  gzTrend: GzTrendPoint[]
  fundName: string
  fundCode: string
} {
  const result = {
    gzTrend: [] as GzTrendPoint[],
    fundName: '',
    fundCode: '',
  }

  try {
    // 提取 Data_gzTrend（当日估值分时走势）
    const gzTrendMatch = jsContent.match(/var\s+Data_gzTrend\s*=\s*(\[[\s\S]*?\]);/)
    if (gzTrendMatch && gzTrendMatch[1]) {
      result.gzTrend = JSON.parse(gzTrendMatch[1])
    }

    // 提取基金名称
    const nameMatch = jsContent.match(/var\s+fS_name\s*=\s*"([^"]+)"/)
    if (nameMatch && nameMatch[1]) {
      result.fundName = nameMatch[1]
    }

    // 提取基金代码
    const codeMatch = jsContent.match(/var\s+fS_code\s*=\s*"([^"]+)"/)
    if (codeMatch && codeMatch[1]) {
      result.fundCode = codeMatch[1]
    }
  } catch (error) {
    console.error('解析 pingzhongdata 失败:', error)
  }

  return result
}

/**
 * 获取基金当日估值分时走势数据（实时折线图）
 * 使用 pingzhongdata 接口，包含 Data_gzTrend 字段
 * 注意：请求频率不宜过高，建议使用防抖
 *
 * @param fcode 基金代码
 * @returns 估值数据数组，格式为 ValuationData[]
 */
export async function fetchGzTrend(fcode: string): Promise<ValuationData[]> {
  try {
    const response = await fetch(`${FUND_DATA_URL}/pingzhongdata/${fcode}.js?v=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        Referer: 'https://fund.eastmoney.com/',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const jsContent = await response.text()
    const { gzTrend } = parsePingzhongData(jsContent)

    // 转换为 ValuationData 格式
    return gzTrend.map(point => {
      const date = new Date(point.x)
      return {
        date: date.toLocaleDateString('zh-CN'),
        time: date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        value: point.y.toFixed(4),
      }
    })
  } catch (error) {
    console.error('获取分时估值数据失败:', error)
    return []
  }
}

/**
 * 获取基金估值详情（优先使用 pingzhongdata，兼容旧接口）
 * 自动选择可用的数据源
 */
export async function fetchValuationDetailWithFallback(fcode: string): Promise<ValuationData[]> {
  // 先尝试 pingzhongdata 接口（更可靠）
  const gzTrendData = await fetchGzTrend(fcode)
  if (gzTrendData.length > 0) {
    return gzTrendData
  }

  // 如果 pingzhongdata 没有数据，尝试原接口
  return fetchValuationDetail(fcode)
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

  const response = await fetch(`${FUND_API_URL}/FundMApi/FundYieldDiagramNew.ashx?${params}`)
  const data = await response.json()

  return {
    data: data.Datas || [],
    indexName: data.Expansion?.INDEXNAME || '基准指数',
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

  const response = await fetch(`${FUND_API_URL}/FundMApi/FundNetDiagram.ashx?${params}`)
  const data = await response.json()
  return data.Datas || []
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

  const response = await fetch(`${FUND_API_URL}/FundMApi/FundBaseTypeInformation.ashx?${params}`)
  const data = await response.json()
  return data.Datas || null
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

  const response = await fetch(`${FUND_API_URL}/FundMNewApi/FundMNInverstPosition?${params}`)
  const data = await response.json()

  return {
    stocks: data.Datas?.fundStocks || [],
    date: data.Expansion || '',
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

  const response = await fetch(`${FUND_API_URL}/FundMApi/FundManagerList.ashx?${params}`)
  const data = await response.json()
  return data.Datas || []
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

  const response = await fetch(`${FUND_API_URL}/FundMApi/FundMangerDetail.ashx?${params}`)
  const data = await response.json()
  return data.Datas || []
}

/**
 * 搜索基金（用于联想输入）
 * @param keyword 搜索关键词（支持代码、名称、拼音）
 */
export async function searchFund(keyword: string): Promise<FundSearchResult[]> {
  if (!keyword.trim()) return []

  const params = buildParams({
    m: 1, // 搜索基金
    key: keyword,
    _: Date.now(),
  })

  try {
    const response = await fetch(`${FUND_SUGGEST_URL}/FundSearch/api/FundSearchAPI.ashx?${params}`)
    const data = await response.json()
    return data.Datas || []
  } catch {
    return []
  }
}
