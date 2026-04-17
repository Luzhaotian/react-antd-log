import { useState, useCallback, useMemo, useEffect } from 'react'
import { Card, Upload, Button, Space, message, Form } from 'antd'
import {
  UploadOutlined,
  ExportOutlined,
  DeleteOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons'
import type { UploadProps } from 'antd'
import JSZip from 'jszip'
import PageDetail from '@/components/PageDetail'
import DataTable from '@/components/DataTable'
import FilePreview from '@/components/FilePreview'
import AppModal from '@/components/AppModal'
import FileRenameDrawer from './FileRenameDrawer'
import { ExportModal, getFileRenameColumns } from './components'
import {
  getFileRenameList,
  createFileRenameItem,
  updateFileRenameItem,
  deleteFileRenameItem,
  batchDeleteFileRenameItems,
  deleteAllFileRenameItems,
} from '@/api/fileRename'
import type { FileRenameItem, FileRenameSavePayload, FileRenameTemplateConfig } from '@/types'
import { createItem } from '@/utils/pages/Tools/FileRename'
import { isSupportedPreviewFile } from '@/utils/components/filePreview'
import { DEFAULT_EXPORT_FILENAME } from '@/constants'

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
  })
}

function base64ToFile(base64: string, originalName: string, fileType?: string): File {
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new File([byteArray], originalName, { type: fileType || '' })
}

export default function FileRename() {
  const [list, setList] = useState<FileRenameItem[]>([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<FileRenameItem | null>(null)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [exportForm] = Form.useForm()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const fetchList = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getFileRenameList()
      const items: FileRenameItem[] = data.map(dto => ({
        id: String(dto.id),
        file: dto.fileDataBase64
          ? base64ToFile(dto.fileDataBase64, dto.originalName, dto.fileType)
          : new File([], dto.originalName, { type: dto.fileType || '' }),
        newName: dto.newName,
        ...(dto.templateConfig && {
          templateConfig: dto.templateConfig as FileRenameTemplateConfig,
        }),
      }))
      setList(items)
    } catch {
      message.error('加载列表失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  const uploadProps: UploadProps = useMemo(
    () => ({
      accept: '*/*',
      multiple: true,
      beforeUpload: async (file: File) => {
        if (!isSupportedPreviewFile(file)) {
          message.warning(
            `不支持预览该类型文件（${file.type || '未知'}），当前支持：图片、PDF、视频、音频、Excel、Word。`
          )
          return false
        }
        try {
          const item = createItem(file)
          const base64 = await fileToBase64(file)
          await createFileRenameItem({
            originalName: file.name,
            newName: item.newName,
            fileType: file.type || undefined,
            fileSize: file.size,
            fileDataBase64: base64,
            templateConfig: item.templateConfig,
          })
          await fetchList()
          message.success('上传成功')
        } catch (e) {
          message.error(e instanceof Error ? e.message : '上传失败')
        }
        return false
      },
      fileList: [],
      showUploadList: false,
    }),
    [fetchList]
  )

  const folderUploadProps: UploadProps = useMemo(
    () => ({
      accept: '*/*',
      directory: true,
      multiple: true,
      beforeUpload: async (file: File) => {
        if (!isSupportedPreviewFile(file)) {
          return false
        }
        try {
          const item = createItem(file)
          const base64 = await fileToBase64(file)
          await createFileRenameItem({
            originalName: file.name,
            newName: item.newName,
            fileType: file.type || undefined,
            fileSize: file.size,
            fileDataBase64: base64,
            templateConfig: item.templateConfig,
          })
          await fetchList()
        } catch (e) {
          message.error(e instanceof Error ? e.message : '上传失败')
        }
        return false
      },
      fileList: [],
      showUploadList: false,
    }),
    [fetchList]
  )

  const handleEdit = useCallback((item: FileRenameItem) => {
    setEditingItem(item)
    setDrawerOpen(true)
  }, [])

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false)
    setEditingItem(null)
  }, [])

  const handleSaveNewName = useCallback(
    async (payload: FileRenameSavePayload) => {
      if (!editingItem) return
      const { newName, ...templateConfig } = payload
      try {
        const id = Number(editingItem.id)
        const base64 = editingItem.file.size > 0 ? await fileToBase64(editingItem.file) : undefined
        await updateFileRenameItem(id, {
          originalName: editingItem.file.name,
          newName,
          fileType: editingItem.file.type || undefined,
          fileSize: editingItem.file.size || undefined,
          ...(base64 && { fileDataBase64: base64 }),
          templateConfig,
        })
        await fetchList()
        message.success('已更新新文件名')
      } catch (e) {
        message.error(e instanceof Error ? e.message : '更新失败')
      }
      setEditingItem(null)
      setDrawerOpen(false)
    },
    [editingItem, fetchList]
  )

  const handleCopy = useCallback(async (newName: string) => {
    try {
      await navigator.clipboard.writeText(newName)
      message.success('已复制到剪贴板')
    } catch {
      message.error('复制失败')
    }
  }, [])

  const handlePreview = useCallback((record: FileRenameItem) => {
    setPreviewFile(record.file)
    setPreviewOpen(true)
  }, [])

  const handlePreviewClose = useCallback(() => {
    setPreviewFile(null)
    setPreviewOpen(false)
  }, [])

  const handleDelete = useCallback(async (item: FileRenameItem) => {
    try {
      await deleteFileRenameItem(Number(item.id))
      setList(prev => prev.filter(it => it.id !== item.id))
      setSelectedRowKeys(prev => prev.filter(key => key !== item.id))
      message.success('已删除')
    } catch (e) {
      message.error(e instanceof Error ? e.message : '删除失败')
    }
  }, [])

  const handleBatchDelete = useCallback(async () => {
    if (selectedRowKeys.length === 0) return
    try {
      await batchDeleteFileRenameItems(selectedRowKeys.map(Number))
      setList(prev => prev.filter(it => !selectedRowKeys.includes(it.id)))
      setSelectedRowKeys([])
      message.success(`成功删除 ${selectedRowKeys.length} 条记录`)
    } catch (e) {
      message.error(e instanceof Error ? e.message : '批量删除失败')
    }
  }, [selectedRowKeys])

  const handleClear = useCallback(async () => {
    try {
      await deleteAllFileRenameItems()
      setList([])
      setSelectedRowKeys([])
      message.success('已清空列表')
    } catch (e) {
      message.error(e instanceof Error ? e.message : '清空失败')
    }
  }, [])

  const handleExportOk = useCallback(
    async (selectedIds: string[]) => {
      const values = exportForm.getFieldsValue()
      const name = values?.filename?.trim()
      if (!name) {
        message.warning('请输入文件名')
        return
      }
      const toExport = list.filter(it => selectedIds.includes(it.id))
      if (toExport.length === 0) {
        message.warning('请至少勾选一个文件')
        return
      }
      const zipName = name.replace(/\.zip$/i, '') + '.zip'
      setExportLoading(true)
      try {
        const zip = new JSZip()
        const nameCount = new Map<string, number>()
        for (const item of toExport) {
          const baseName = item.newName
          const n = (nameCount.get(baseName) ?? 0) + 1
          nameCount.set(baseName, n)
          const zipPath =
            n === 1 ? baseName : baseName.replace(/(\.[^.]*)?$/, (_, ext) => ` (${n})${ext ?? ''}`)
          zip.file(zipPath, item.file)
        }
        const blob = await zip.generateAsync({
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: { level: 5 },
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = zipName
        a.click()
        URL.revokeObjectURL(url)
        message.success(`导出成功，共 ${toExport.length} 个文件`)
        setExportModalOpen(false)
        exportForm.resetFields()
      } catch (e) {
        message.error('导出失败')
      } finally {
        setExportLoading(false)
      }
    },
    [list, exportForm]
  )

  const columns = useMemo(
    () =>
      getFileRenameColumns({
        handlePreview,
        handleEdit,
        handleCopy,
        handleDelete,
      }),
    [handlePreview, handleEdit, handleCopy, handleDelete]
  )

  return (
    <PageDetail
      title="文件重命名"
      description="上传多个文件或文件夹，为每条设置新文件名后可导出为 zip 或复制新文件名；列表数据自动持久化"
      contentClassName="h-full"
      extra={
        <Space>
          <Button
            danger
            icon={<DeleteOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={() => {
              AppModal.confirm({
                title: '确认批量删除',
                content: `确定要删除选中的 ${selectedRowKeys.length} 条记录吗？`,
                okText: '确定',
                cancelText: '取消',
                onOk: handleBatchDelete,
              })
            }}
          >
            批量删除{selectedRowKeys.length > 0 ? `(${selectedRowKeys.length})` : ''}
          </Button>
          <Button icon={<DeleteOutlined />} onClick={handleClear} disabled={list.length === 0}>
            清空
          </Button>
          <Button
            type="primary"
            icon={<ExportOutlined />}
            onClick={() => {
              setExportModalOpen(true)
              exportForm.setFieldsValue({ filename: DEFAULT_EXPORT_FILENAME })
            }}
            disabled={list.length === 0}
          >
            导出
          </Button>
        </Space>
      }
    >
      <Card
        className="h-full min-h-[calc(100vh-12rem)] shadow-sm"
        styles={{ body: { padding: '24px 28px', minHeight: 'calc(100vh - 180px)' } }}
      >
        <Space direction="vertical" size="middle" className="w-full">
          <Space wrap>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>上传文件</Button>
            </Upload>
            <Upload {...folderUploadProps}>
              <Button icon={<FolderOpenOutlined />}>上传文件夹</Button>
            </Upload>
          </Space>

          <DataTable<FileRenameItem>
            columns={columns}
            dataSource={list}
            rowKey="id"
            loading={loading}
            pagination={false}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            emptyText="暂无文件，请先上传文件或文件夹"
          />
        </Space>
      </Card>

      <FileRenameDrawer
        open={drawerOpen}
        item={editingItem}
        onClose={handleDrawerClose}
        onSave={handleSaveNewName}
      />

      <AppModal
        title={`预览：${previewFile?.name ?? ''}`}
        open={previewOpen}
        onCancel={handlePreviewClose}
        footer={null}
        width="90vw"
        styles={{ body: { maxHeight: '80vh', overflow: 'auto' } }}
      >
        <FilePreview file={previewFile} height="75vh" showFileName />
      </AppModal>

      <ExportModal
        open={exportModalOpen}
        loading={exportLoading}
        list={list}
        form={exportForm}
        onOk={handleExportOk}
        onCancel={() => {
          setExportModalOpen(false)
          exportForm.resetFields()
        }}
      />
    </PageDetail>
  )
}
