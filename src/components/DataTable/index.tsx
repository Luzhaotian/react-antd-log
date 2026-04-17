import { Table as AntdTable, Spin } from 'antd'
import { useState, useEffect } from 'react'
import type { CustomTableProps } from '@/types'

function DataTable<T extends Record<string, any> = any>({
  dataSource = [],
  loading = false,
  bordered = true,
  striped = false,
  emptyText = '暂无数据',
  autoHeight = false,
  className = '',
  ...restProps
}: CustomTableProps<T>) {
  const [tableHeight, setTableHeight] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (autoHeight) {
      const calculateHeight = () => {
        const windowHeight = window.innerHeight
        // 减去头部、padding、分页等高度，大约预留 300px
        const height = windowHeight - 300
        setTableHeight(Math.max(height, 400))
      }

      calculateHeight()
      window.addEventListener('resize', calculateHeight)
      return () => window.removeEventListener('resize', calculateHeight)
    }
  }, [autoHeight])

  const tableClassName = [
    striped &&
      '[&_.ant-table-tbody>tr:nth-child(even)]:bg-[#fafafa] [&_.ant-table-tbody>tr:hover]:!bg-[#e6f7ff]',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="w-full">
      <AntdTable<T>
        {...restProps}
        dataSource={dataSource}
        loading={loading}
        bordered={bordered}
        className={tableClassName}
        scroll={
          autoHeight
            ? {
                y: tableHeight,
                x: restProps.scroll?.x || 'max-content',
              }
            : { ...restProps.scroll, x: restProps.scroll?.x || 'max-content' }
        }
        locale={{
          emptyText: (
            <div className="py-10 text-center text-[rgba(0,0,0,0.45)]">
              {loading ? <Spin /> : emptyText}
            </div>
          ),
        }}
      />
    </div>
  )
}

export default DataTable
