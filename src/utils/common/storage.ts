/**
 * 本地存储工具
 */
import { STORAGE_KEYS } from '@/constants'

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

/**
 * 通用本地存储工具
 */
export const storage = {
  /**
   * 获取存储的值
   */
  get<T>(key: StorageKey): T | null {
    const value = localStorage.getItem(key)
    if (!value) return null
    try {
      return JSON.parse(value) as T
    } catch {
      return null
    }
  },

  /**
   * 设置存储的值
   */
  set<T>(key: StorageKey, value: T): void {
    localStorage.setItem(key, JSON.stringify(value))
  },

  /**
   * 移除存储的值
   */
  remove(key: StorageKey): void {
    localStorage.removeItem(key)
  },

  /**
   * 清空所有本项目的存储
   */
  clear(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  },
}
