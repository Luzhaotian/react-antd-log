import { Button, Space, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { getPreviewTypeLabel } from '@/utils'
import AppModal from '@/components/AppModal'
import type { FileRenameItem, FileRenameTableHandlers } from '@/types'
import { getExtension } from '@/utils'

/** 获取文件重命名表格列 */
export function getFileRenameColumns(
  /** 处理器 */
  handlers: FileRenameTableHandlers
): ColumnsType<FileRenameItem> {
  const { handlePreview, handleEdit, handleCopy, handleDelete } = handlers
  return [
    {
      title: '原文件名',
      dataIndex: 'file',
      key: 'originalName',
      ellipsis: true,
      render: (_: unknown, record: FileRenameItem) => (
        <Tooltip title={record.file.name}>
          <span>{record.file.name}</span>
        </Tooltip>
      ),
    },
    {
      title: '新文件名',
      dataIndex: 'newName',
      key: 'newName',
      ellipsis: true,
      render: (name: string) => (
        <Tooltip title={name}>
          <span>{name}</span>
        </Tooltip>
      ),
    },
    {
      title: '文件类型',
      dataIndex: 'file',
      key: 'fileType',
      width: 100,
      render: (_: unknown, record: FileRenameItem) => {
        const label = getPreviewTypeLabel(record.file)
        const suffix = getExtension(record.file.name) || '—'
        return `${label} / ${suffix}`
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: FileRenameItem) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handlePreview(record)}>
            预览
          </Button>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" onClick={() => handleCopy(record.newName)}>
            复制新文件名
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => {
              AppModal.confirm({
                title: '确认删除',
                content: `确定要删除「${record.file.name}」吗？`,
                okText: '确定',
                cancelText: '取消',
                onOk: () => handleDelete(record),
              })
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]
}
