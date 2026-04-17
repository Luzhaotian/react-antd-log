import type { PaginationProps } from 'antd'

/** 自定义 Pagination 组件属性 */
export interface CustomPaginationProps extends Omit<PaginationProps, 'showTotal'> {
  /** 是否显示总条数 */
  showTotal?: boolean
  /** 是否显示快速跳转 */
  showQuickJumper?: boolean
  /** 是否显示每页条数选择 */
  showSizeChanger?: boolean
  /** 每页条数选项 */
  pageSizeOptions?: string[]
  /** 默认每页条数 */
  defaultPageSize?: number
  /** 总条数 */
  total?: number
  /** 当前页 */
  current?: number
  /** 每页条数 */
  pageSize?: number
  /** 页码改变回调 */
  onChange?: (page: number, pageSize: number) => void
  /** 每页条数改变回调 */
  onShowSizeChange?: (current: number, size: number) => void
}
