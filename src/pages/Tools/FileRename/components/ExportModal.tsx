import { useState, useEffect } from 'react'
import { Form, Input, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AppModal from '@/components/AppModal'
import type { ExportModalProps, FileRenameItem } from '@/types'
import { DEFAULT_EXPORT_FILENAME } from '@/constants'

function ExportModal({ open, loading, list, form, onOk, onCancel }: ExportModalProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])

  useEffect(() => {
    if (open && list.length > 0) {
      setSelectedRowKeys(list.map(item => item.id))
    }
  }, [open, list])

  const handleOk = () => {
    return form.validateFields().then(() => {
      const name = form.getFieldValue('filename')?.trim()
      if (!name) return
      if (selectedRowKeys.length === 0) return
      return onOk(selectedRowKeys)
    })
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys as string[]),
  }

  const columns: ColumnsType<FileRenameItem> = [
    {
      title: '原文件名',
      dataIndex: 'file',
      key: 'originalName',
      ellipsis: true,
      render: (_: unknown, record: FileRenameItem) => record.file.name,
    },
    {
      title: '新文件名',
      dataIndex: 'newName',
      key: 'newName',
      ellipsis: true,
    },
  ]

  const selectedCount = selectedRowKeys.length

  return (
    <AppModal
      title="导出"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText="导出"
      cancelText="取消"
      okButtonProps={{ disabled: selectedCount === 0 }}
    >
      <Form form={form} layout="vertical" initialValues={{ filename: DEFAULT_EXPORT_FILENAME }}>
        <Form.Item
          name="filename"
          label="文件名（不含 .zip）"
          rules={[{ required: true, message: '请输入文件名' }]}
        >
          <Input placeholder={DEFAULT_EXPORT_FILENAME} allowClear />
        </Form.Item>
      </Form>
      <div className="mb-2 text-sm text-gray-500">
        勾选要导出的文件，将打包为「文件名.zip」下载。已选 {selectedCount} / {list.length} 个。
      </div>
      <Table<FileRenameItem>
        rowKey="id"
        size="small"
        pagination={false}
        scroll={{ y: 240 }}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={list}
      />
    </AppModal>
  )
}

export default ExportModal
