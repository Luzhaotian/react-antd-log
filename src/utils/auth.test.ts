import { afterEach, describe, expect, it } from 'vitest'
import {
  clearAuthSession,
  getAuthToken,
  getAuthUsername,
  isLoggedIn,
  setAuthSession,
} from '@/utils/auth'

describe('auth', () => {
  afterEach(() => {
    clearAuthSession()
  })

  it('无 token 时未登录', () => {
    expect(isLoggedIn()).toBe(false)
    expect(getAuthToken()).toBeNull()
  })

  it('设置会话后判定已登录', () => {
    setAuthSession('tok-1', 'alice')
    expect(isLoggedIn()).toBe(true)
    expect(getAuthToken()).toBe('tok-1')
    expect(getAuthUsername()).toBe('alice')
  })

  it('空 token 会清空会话', () => {
    setAuthSession('tok-1', 'alice')
    setAuthSession('  ', 'bob')
    expect(isLoggedIn()).toBe(false)
  })

  it('clearAuthSession 清除登录态', () => {
    setAuthSession('tok-1', 'alice')
    clearAuthSession()
    expect(isLoggedIn()).toBe(false)
    expect(getAuthUsername()).toBe('用户')
  })
})
