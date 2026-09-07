import { beforeEach, describe, expect, it, vi } from 'vitest'
import { COMPRESS_TYPE } from '@/constants'

vi.mock('antd', () => ({
  message: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

describe('CodeCompress', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('detectCodeType 识别 JSON / HTML / CSS / JS', async () => {
    const { detectCodeType } = await import('@/utils/pages/Tools/CodeCompress')
    expect(detectCodeType('{"a":1}')).toBe(COMPRESS_TYPE.JSON)
    expect(detectCodeType('[1,2]')).toBe(COMPRESS_TYPE.JSON)
    expect(detectCodeType('<div class="x">hi</div>')).toBe(COMPRESS_TYPE.HTML)
    expect(detectCodeType('.btn { color: red; }')).toBe(COMPRESS_TYPE.CSS)
    expect(detectCodeType('const fn = () => {}')).toBe(COMPRESS_TYPE.JS)
    expect(detectCodeType('')).toBe(COMPRESS_TYPE.JSON)
  })

  it('formatCodeByType 格式化 JSON', async () => {
    const { formatCodeByType } = await import('@/utils/pages/Tools/CodeCompress')
    const out = formatCodeByType('{"a":1,"b":[2]}', COMPRESS_TYPE.JSON)
    expect(out).toContain('\n')
    expect(JSON.parse(out)).toEqual({ a: 1, b: [2] })
  })

  it('无效 JSON 原样返回并提示', async () => {
    const { message } = await import('antd')
    const { formatCodeByType } = await import('@/utils/pages/Tools/CodeCompress')
    const raw = '{a:1}'
    expect(formatCodeByType(raw, COMPRESS_TYPE.JSON)).toBe(raw)
    expect(message.error).toHaveBeenCalled()
  })

  it('formatCodeByType 格式化简单 CSS', async () => {
    const { formatCodeByType } = await import('@/utils/pages/Tools/CodeCompress')
    const out = formatCodeByType('.a{color:red}', COMPRESS_TYPE.CSS)
    expect(out).toContain('.a {')
    expect(out).toContain('}')
  })
})
