import type { TableProps } from 'antd'

/** 自定义 DataTable 组件属性 */
export interface CustomTableProps<T = unknown> extends Omit<TableProps<T>, 'loading'> {
  /** 数据源 */
  dataSource?: T[]
  /** 加载中 */
  loading?: boolean
  /** 是否显示边框 */
  bordered?: boolean
  /** 是否显示斑马纹 */
  striped?: boolean
  /** 空数据提示文本 */
  emptyText?: string
  /** 是否自动高度 */
  autoHeight?: boolean
}
