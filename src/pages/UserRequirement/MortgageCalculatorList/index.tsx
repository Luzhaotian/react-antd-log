import { useState, useCallback, useEffect } from 'react'
import { Card, Button, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import ListPage from '@/components/ListPage'
import DataTable from '@/components/DataTable'
import AppModal from '@/components/AppModal'
import MortgageCalculatorDrawer from './components/MortgageCalculatorDrawer'
import { getMortgageColumns } from './components/getTableColumns'
import type { MortgageRecord, MortgageDrawerMode } from '@/types'
import { loadMortgageList, saveMortgageList } from '@/utils'

export default function MortgageCalculatorList() {
  const [list, setList] = useState<MortgageRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<MortgageDrawerMode>('add')
  const [editingRecord, setEditingRecord] = useState<MortgageRecord | null>(null)

  const loadList = useCallback(async () => {
    setLoading(true)
    try {
      const data = await loadMortgageList()
      setList(data)
    } catch {
      message.error('加载列表失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadList()
  }, [loadList])

  useEffect(() => {
    if (!loading && list.length >= 0) {
      saveMortgageList(list).catch(() => message.error('保存列表失败'))
    }
  }, [list, loading])

  const handleAdd = useCallback(() => {
    setEditingRecord(null)
    setDrawerMode('add')
    setDrawerOpen(true)
  }, [])

  const handleView = useCallback((record: MortgageRecord) => {
    setEditingRecord(record)
    setDrawerMode('view')
    setDrawerOpen(true)
  }, [])

  const handleEdit = useCallback((record: MortgageRecord) => {
    setEditingRecord(record)
    setDrawerMode('edit')
    setDrawerOpen(true)
  }, [])

  const handleDelete = useCallback((record: MortgageRecord) => {
    AppModal.confirm({
      title: '确认删除',
      content: `确定要删除「${record.name}」吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setList(prev => prev.filter(it => it.id !== record.id))
        message.success('已删除')
      },
    })
  }, [])

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false)
    setEditingRecord(null)
  }, [])

  const handleSave = useCallback(
    (record: MortgageRecord) => {
      setList(prev => {
        const idx = prev.findIndex(it => it.id === record.id)
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = record
          return next
        }
        return [record, ...prev]
      })
      message.success(drawerMode === 'add' ? '新增成功' : '保存成功')
    },
    [drawerMode]
  )

  const columns = getMortgageColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  return (
    <>
      <ListPage
        title="房贷计算器列表"
        description="管理房贷计算方案，数据保存在本地 IndexedDB；支持新增、编辑、查看，抽屉内可修改参数并查看每月还款明细"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增
          </Button>
        }
      >
        <Card size="small">
          <DataTable<MortgageRecord>
            columns={columns}
            dataSource={list}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10, showSizeChanger: true, showTotal: t => `共 ${t} 条` }}
            emptyText="暂无数据，点击「新增」创建房贷计算"
          />
        </Card>
      </ListPage>

      <MortgageCalculatorDrawer
        open={drawerOpen}
        mode={drawerMode}
        record={editingRecord}
        onClose={handleDrawerClose}
        onSave={handleSave}
      />
    </>
  )
}
