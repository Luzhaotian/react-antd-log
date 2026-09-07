import { afterEach, describe, expect, it, vi } from 'vitest'
import { logger } from '@/utils/logger'

describe('logger', () => {
  afterEach(() => {
    logger.clear()
    vi.restoreAllMocks()
  })

  it('记录 error 到缓冲区', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    logger.error('boom', new Error('x'))
    const recent = logger.getRecent()
    expect(recent).toHaveLength(1)
    expect(recent[0]?.level).toBe('error')
    expect(recent[0]?.message).toBe('boom')
  })

  it('缓冲区有上限', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    for (let i = 0; i < 60; i++) {
      logger.error(`m-${i}`)
    }
    expect(logger.getRecent().length).toBe(50)
    expect(logger.getRecent()[0]?.message).toBe('m-10')
  })
})
