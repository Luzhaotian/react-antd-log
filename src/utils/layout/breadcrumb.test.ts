import { describe, expect, it } from 'vitest'
import { buildFullPath, isPathMatch } from '@/utils/layout/breadcrumb'

describe('buildFullPath', () => {
  it('拼接相对子路径', () => {
    expect(buildFullPath('/tools', 'qrcode')).toBe('/tools/qrcode')
  })

  it('绝对路径覆盖父路径', () => {
    expect(buildFullPath('/tools', '/login')).toBe('/login')
  })

  it('根父路径加斜杠', () => {
    expect(buildFullPath('/', 'home')).toBe('/home')
  })
})

describe('isPathMatch', () => {
  it('精确匹配', () => {
    expect(isPathMatch('/user/list', '/user/list')).toBe(true)
  })

  it('动态段匹配', () => {
    expect(isPathMatch('/user/:id', '/user/42')).toBe(true)
    expect(isPathMatch('/user/:id', '/user/42/edit')).toBe(false)
  })
})
