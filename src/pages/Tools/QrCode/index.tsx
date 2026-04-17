import { useCallback, useMemo, useState } from 'react'
import { Button, Form } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import ListPage from '@/components/ListPage'
import type { SearchBarProps } from '@/types/components/searchBar'
import type { QrCodeItem, QrFormValues } from '@/types'
import { QrCodeModal, QrCodeTable } from './components'
import useQrCodeManager from '@/hooks/useQrCodeManager'

function QrCodePage() {
  const [form] = Form.useForm<QrFormValues>()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<QrCodeItem | null>(null)
  const {
    contextHolder,
    loading,
    saving,
    filteredList,
    setKeyword,
    setSaving,
    createQrCode,
    updateQrCode,
    deleteQrCode,
  } = useQrCodeManager()

  const openCreateModal = useCallback(() => {
    setEditingRecord(null)
    form.setFieldsValue({ text: '' })
    setModalOpen(true)
  }, [form])

  const openEditModal = useCallback(
    (record: QrCodeItem) => {
      setEditingRecord(record)
      form.setFieldsValue({ text: record.text })
      setModalOpen(true)
    },
    [form]
  )

  const handleCancelModal = useCallback(() => {
    setModalOpen(false)
    setEditingRecord(null)
    form.resetFields()
  }, [form])

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields()
      const text = values.text.trim()
      setSaving(true)

      if (editingRecord) {
        await updateQrCode(editingRecord.id, text)
      } else {
        await createQrCode(text)
      }

      handleCancelModal()
    } catch {
      // 表单校验失败时不提示错误 message
    } finally {
      setSaving(false)
    }
  }, [createQrCode, editingRecord, form, handleCancelModal, setSaving, updateQrCode])

  const searchBarProps: SearchBarProps = useMemo(
    () => ({
      fields: [
        {
          name: 'keyword',
          label: '关键词',
          placeholder: '按二维码内容搜索',
        },
      ],
      onSearch: values => {
        setKeyword((values.keyword ?? '').trim())
      },
      onReset: () => {
        setKeyword('')
      },
    }),
    [setKeyword]
  )

  return (
    <ListPage
      title="二维码管理"
      description="输入文字即可转成二维码，支持本地持久化的增删改查"
      searchBarProps={searchBarProps}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          新增二维码
        </Button>
      }
    >
      {contextHolder}
      <QrCodeTable
        loading={loading}
        dataSource={filteredList}
        onEdit={openEditModal}
        onDelete={deleteQrCode}
      />

      <QrCodeModal
        open={modalOpen}
        saving={saving}
        editingRecord={editingRecord}
        form={form}
        onCancel={handleCancelModal}
        onSubmit={handleSubmit}
      />
    </ListPage>
  )
}

export default QrCodePage
