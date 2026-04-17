/**
 * IndexedDB 存储 key 统一管理（idb-keyval 使用）
 * 所有使用 IndexedDB 的模块应只使用此处定义的 key，便于维护与排查
 */
export const IDB_KEYS = {
  /** 房贷计算列表（用户需求 - 房贷计算机） */
  MORTGAGE_CALCULATOR_LIST: 'mortgage-calculator-list',
  /** 文件重命名列表（工具 - 文件重命名） */
  FILE_RENAME_LIST: 'file-rename-list',
  /** 二维码列表（工具 - 二维码管理） */
  QR_CODE_LIST: 'qr-code-list',
} as const

export type IdbKey = (typeof IDB_KEYS)[keyof typeof IDB_KEYS]
