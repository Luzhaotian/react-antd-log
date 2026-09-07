import { afterEach, describe, expect, it } from 'vitest'
import { storage } from '@/utils/common/storage'
import { STORAGE_KEYS } from '@/constants'

describe('storage', () => {
  afterEach(() => {
    storage.clear()
  })

  it('读写对象', () => {
    storage.set(STORAGE_KEYS.FUND_CODES, ['110022', '005827'])
    expect(storage.get<string[]>(STORAGE_KEYS.FUND_CODES)).toEqual(['110022', '005827'])
  })

  it('不存在返回 null', () => {
    expect(storage.get(STORAGE_KEYS.LOAN_TRACKER)).toBeNull()
  })

  it('非法 JSON 返回 null', () => {
    localStorage.setItem(STORAGE_KEYS.FUND_CODES, '{broken')
    expect(storage.get(STORAGE_KEYS.FUND_CODES)).toBeNull()
  })

  it('remove 只删指定 key', () => {
    storage.set(STORAGE_KEYS.FUND_CODES, ['a'])
    storage.set(STORAGE_KEYS.LOAN_TRACKER, { id: 1 })
    storage.remove(STORAGE_KEYS.FUND_CODES)
    expect(storage.get(STORAGE_KEYS.FUND_CODES)).toBeNull()
    expect(storage.get<{ id: number }>(STORAGE_KEYS.LOAN_TRACKER)).toEqual({ id: 1 })
  })

  it('clear 清空项目相关 key', () => {
    storage.set(STORAGE_KEYS.FUND_CODES, ['a'])
    storage.set(STORAGE_KEYS.LOAN_TRACKER, { id: 1 })
    storage.clear()
    expect(storage.get(STORAGE_KEYS.FUND_CODES)).toBeNull()
    expect(storage.get(STORAGE_KEYS.LOAN_TRACKER)).toBeNull()
  })
})
