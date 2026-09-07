import { useState } from 'react'
import { Form, Input, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import AppModal from '@/components/AppModal'
import type { ExportModalProps, FileRenameItem } from '@/types'
import { DEFAULT_EXPORT_FILENAME } from '@/constants'

function ExportModal({ open, loading, list, form, onOk, onCancel }: ExportModalProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const listKey = list.map(item => item.id).join('|')
  const [synced, setSynced] = useState({ open: false, listKey: '' })

  // 打开弹窗或列表变化时默认可全选（渲染期同步，避免 effect 内 setState）
  if (open !== synced.open || listKey !== synced.listKey) {
    setSynced({ open, listKey })
    if (open && list.length > 0) {
      setSelectedRowKeys(list.map(item => item.id))
    }
  }

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
