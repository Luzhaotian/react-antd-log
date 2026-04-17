import { useCallback, useEffect, useMemo, useState } from 'react'
import { message } from 'antd'
import { IDB_KEYS } from '@/constants/idbKeys'
import { idbGet, idbSet, generateQrCode } from '@/utils'
import type { QrCodeItem } from '@/types'

function useQrCodeManager() {
  const [messageApi, contextHolder] = message.useMessage()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [list, setList] = useState<QrCodeItem[]>([])

  const loadList = useCallback(async () => {
    setLoading(true)
    try {
      const data = await idbGet(IDB_KEYS.QR_CODE_LIST)
      const records = Array.isArray(data) ? (data as QrCodeItem[]) : []
      setList(records)
    } catch {
      messageApi.error('读取二维码列表失败')
    } finally {
      setLoading(false)
    }
  }, [messageApi])

  useEffect(() => {
    void loadList()
  }, [loadList])

  const saveList = useCallback(async (records: QrCodeItem[]) => {
    setList(records)
    await idbSet(IDB_KEYS.QR_CODE_LIST, records)
  }, [])

  const filteredList = useMemo(() => {
    const trimmedKeyword = keyword.trim().toLowerCase()
    if (!trimmedKeyword) {
      return list
    }
    return list.filter(item => item.text.toLowerCase().includes(trimmedKeyword))
  }, [list, keyword])

  const createQrCode = useCallback(
    async (text: string) => {
      const imageUrl = await generateQrCode(text)
      const now = Date.now()
      const next: QrCodeItem[] = [
        {
          id: crypto.randomUUID(),
          text,
          imageUrl,
          createdAt: now,
          updatedAt: now,
        },
        ...list,
      ]
      await saveList(next)
      messageApi.success('新增成功')
    },
    [list, messageApi, saveList]
  )

  const updateQrCode = useCallback(
    async (id: string, text: string) => {
      const imageUrl = await generateQrCode(text)
      const now = Date.now()
      const next = list.map(item =>
        item.id === id
          ? {
              ...item,
              text,
              imageUrl,
              updatedAt: now,
            }
          : item
      )
      await saveList(next)
      messageApi.success('更新成功')
    },
    [list, messageApi, saveList]
  )

  const deleteQrCode = useCallback(
    async (id: string) => {
      try {
        const next = list.filter(item => item.id !== id)
        await saveList(next)
        messageApi.success('删除成功')
      } catch {
        messageApi.error('删除失败')
      }
    },
    [list, messageApi, saveList]
  )

  return {
    contextHolder,
    loading,
    saving,
    list,
    filteredList,
    keyword,
    setKeyword,
    setSaving,
    createQrCode,
    updateQrCode,
    deleteQrCode,
  }
}

export default useQrCodeManager
