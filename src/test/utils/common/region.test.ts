import { describe, expect, it } from 'vitest'
import { regionPathToString, stringToRegionPath } from '@/utils/common/region'

describe('region', () => {
  it('path 数组转字符串', () => {
    expect(regionPathToString(['北京市', '市辖区', '朝阳区'])).toBe('北京市/市辖区/朝阳区')
    expect(regionPathToString(undefined)).toBe('')
    expect(regionPathToString('已是字符串')).toBe('已是字符串')
  })

  it('字符串还原为 path', () => {
    expect(stringToRegionPath('北京市/市辖区/朝阳区')).toEqual(['北京市', '市辖区', '朝阳区'])
    expect(stringToRegionPath('')).toEqual([])
    expect(stringToRegionPath(undefined)).toEqual([])
  })

  it('往返一致', () => {
    const path = ['浙江省', '杭州市', '西湖区']
    expect(stringToRegionPath(regionPathToString(path))).toEqual(path)
  })
})
