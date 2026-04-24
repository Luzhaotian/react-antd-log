/**
 * API 相关常量配置
 *
 * - 开发（Vite dev）：使用以 `/` 开头的路径，走 `vite.config.ts` 里 proxy，避免浏览器跨域。
 * - 生产（GitHub Pages 等静态托管）：无 Node 代理，必须使用完整源站 URL，否则会请求到
 *   `https://<pages 域名>/fundgz/...` 导致 404。东财 fundmobapi / fundsuggest 等在生产环境由
 *   `src/api/fund.ts` 通过 JSONP（`<script>` + `callback`）请求，避免 fetch 被 CORS 拦截。
 *
 * 源站与 vite 代理 rewrite 保持一致。
 */
const FUND_API_ORIGIN = 'https://fundmobapi.eastmoney.com'
const FUND_REALTIME_ORIGIN = 'https://fundgz.1234567.com.cn'
const FUND_SUGGEST_ORIGIN = 'https://fundsuggest.eastmoney.com'
const FUND_DATA_ORIGIN = 'https://fund.eastmoney.com'
const DATA_CENTER_ORIGIN = 'https://datacenter-web.eastmoney.com'

const useProxyPaths = import.meta.env.DEV

/** 基金 API（东方财富） */
export const FUND_API_URL: string = useProxyPaths ? '/fundapi' : FUND_API_ORIGIN

/** 实时估值 API（天天基金） */
export const FUND_REALTIME_URL: string = useProxyPaths ? '/fundgz' : FUND_REALTIME_ORIGIN

/** 基金搜索联想 API */
export const FUND_SUGGEST_URL: string = useProxyPaths ? '/fundsuggest' : FUND_SUGGEST_ORIGIN

/** 基金详情数据 API（包含分时估值走势 Data_gzTrend） */
export const FUND_DATA_URL: string = useProxyPaths ? '/funddata' : FUND_DATA_ORIGIN

/** 东方财富数据中心 API（LPR 等） */
export const DATA_CENTER_URL: string = useProxyPaths ? '/datacenter' : DATA_CENTER_ORIGIN

/** 通用请求参数（Wap 平台） */
export const COMMON_WAP_PARAMS = {
  /** 设备 ID */
  deviceid: 'Wap',
  /** 平台 */
  plat: 'Wap',
  /** 产品 */
  product: 'EFund',
  /** 版本 */
  version: '2.0.0',
  /** 用户 ID */
  Uid: '',
  /** 时间戳 */
} as const
