import { Pagination as AntdPagination } from 'antd'
import type { CustomPaginationProps } from '@/types'

function Pagination({
  showTotal = true,
  showQuickJumper = true,
  showSizeChanger = true,
  pageSizeOptions = ['10', '20', '50', '100'],
  defaultPageSize = 10,
  total = 0,
  current = 1,
  pageSize = 10,
  onChange,
  onShowSizeChange,
  className = '',
  ...restProps
}: CustomPaginationProps) {
  const paginationClassName = ['custom-pagination', className].filter(Boolean).join(' ')

  return (
    <div className="flex justify-end mt-4 py-4 md:justify-end md:justify-center [&_.ant-pagination-options]:hidden md:[&_.ant-pagination-options]:block">
      <AntdPagination
        {...restProps}
        className={paginationClassName}
        total={total}
        current={current}
        pageSize={pageSize}
        defaultPageSize={defaultPageSize}
        showTotal={showTotal ? total => `共 ${total} 条` : undefined}
        showQuickJumper={showQuickJumper}
        showSizeChanger={showSizeChanger}
        pageSizeOptions={pageSizeOptions}
        onChange={onChange}
        onShowSizeChange={onShowSizeChange}
      />
    </div>
  )
}

export default Pagination
