import { describe, expect, it } from 'vitest'
import { buildFullPath, findRoutePath, isPathMatch } from '@/utils/layout/breadcrumb'
import type { ExtendedRouteObject } from '@/types'

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

  it('空子路径返回父路径', () => {
    expect(buildFullPath('/tools', '')).toBe('/tools')
    expect(buildFullPath('/tools', undefined)).toBe('/tools')
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

describe('findRoutePath', () => {
  const routes: ExtendedRouteObject[] = [
    {
      path: '/tools',
      meta: { name: '工具' },
      children: [
        { path: 'qrcode', meta: { name: '二维码' } },
        { path: 'json', meta: { name: 'JSON' } },
      ],
    },
  ]

  it('返回面包屑路径链', () => {
    expect(findRoutePath(routes, '/tools/qrcode')).toEqual([
      { path: '/tools', name: '工具' },
      { path: '/tools/qrcode', name: '二维码' },
    ])
  })

  it('未匹配返回 null', () => {
    expect(findRoutePath(routes, '/missing')).toBeNull()
  })
})
