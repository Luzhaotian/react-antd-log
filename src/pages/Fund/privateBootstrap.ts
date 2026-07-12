import type { FundHoldingsMap, FundInfo } from '@/types'
import { DEFAULT_FUND_CODES, FUND_PRIVATE_SNAPSHOT_NOTE, STORAGE_KEYS } from '@/constants'
import { storage } from '@/utils'

export interface PrivateFundBootstrapModule {
  ALIPAY_FUND_ORDER: string[]
  buildHoldingsFromFunds: (funds: FundInfo[]) => FundHoldingsMap
}

/**
 * 读取本机 gitignore 的 src/private/fund-portfolio/bootstrap.ts。
 * 目录或文件不存在时返回 null，基金页将回退 DEFAULT_FUND_CODES + IDB 手动持仓。
 */
export function getPrivateFundBootstrap(): PrivateFundBootstrapModule | null {
  const modules = import.meta.glob<PrivateFundBootstrapModule>(
    '@/private/fund-portfolio/bootstrap.ts',
    { eager: true }
  )
  const mod = Object.values(modules)[0]
  if (!mod?.ALIPAY_FUND_ORDER?.length || typeof mod.buildHoldingsFromFunds !== 'function') {
    return null
  }
  return mod
}

/**
 * 初始基金列表：
 * - 有私有快照 → 支付宝截图顺序
 * - 无私有且曾用过快照 → 回退 DEFAULT_FUND_CODES
 * - 否则 → localStorage 或 DEFAULT_FUND_CODES
 */
export function resolveInitialFundCodes(
  privateBootstrap: PrivateFundBootstrapModule | null
): string[] {
  if (privateBootstrap) {
    storage.set(STORAGE_KEYS.FUND_PRIVATE_BOOTSTRAP, true)
    return privateBootstrap.ALIPAY_FUND_ORDER
  }

  const hadPrivateSnapshot = storage.get<boolean>(STORAGE_KEYS.FUND_PRIVATE_BOOTSTRAP)
  if (hadPrivateSnapshot) {
    storage.remove(STORAGE_KEYS.FUND_PRIVATE_BOOTSTRAP)
    storage.remove(STORAGE_KEYS.FUND_CODES)
    return [...DEFAULT_FUND_CODES]
  }

  return storage.get<string[]>(STORAGE_KEYS.FUND_CODES) ?? DEFAULT_FUND_CODES
}

export { FUND_PRIVATE_SNAPSHOT_NOTE }
