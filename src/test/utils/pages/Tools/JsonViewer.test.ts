import { describe, expect, it } from 'vitest'
import {
  countJsonItems,
  getDepthColors,
  getTypeTagColor,
  getTypeText,
  getValueSummary,
  getValueType,
} from '@/utils/pages/Tools/JsonViewer'

describe('JsonViewer 工具函数', () => {
  it('getValueType', () => {
    expect(getValueType(null)).toBe('null')
    expect(getValueType([1])).toBe('array')
    expect(getValueType({ a: 1 })).toBe('object')
    expect(getValueType('s')).toBe('string')
    expect(getValueType(1)).toBe('number')
    expect(getValueType(true)).toBe('boolean')
  })

  it('getTypeText / getTypeTagColor', () => {
    expect(getTypeText('array')).toBe('数组')
    expect(getTypeText('unknown')).toBe('unknown')
    expect(getTypeTagColor('string')).toBe('green')
    expect(getTypeTagColor('number')).toBe('blue')
  })

  it('getValueSummary', () => {
    expect(getValueSummary({ a: 1, b: 2 }, 'object')).toBe('{ 2 个属性 }')
    expect(getValueSummary([1, 2, 3], 'array')).toBe('[ 3 个元素 ]')
  })

  it('countJsonItems 递归计数（含叶子节点）', () => {
    // root + a + [b] + 2 + {c} + 3 = 6
    expect(countJsonItems({ a: 1, b: [2, { c: 3 }] })).toBe(6)
    // array 节点 + 两个叶子 = 3
    expect(countJsonItems([1, 2])).toBe(3)
    expect(countJsonItems(1)).toBe(1)
  })

  it('getDepthColors 循环取色', () => {
    const d0 = getDepthColors(0)
    const d8 = getDepthColors(8)
    expect(d0).toEqual(d8)
    expect(getDepthColors(1).barBg).not.toBe(d0.barBg)
  })
})
