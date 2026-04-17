/**
 * 国内省市区三级联动数据（地级及以上：省、地级市、区县）
 * 数据来源：element-china-area-data（基于 modood/Administrative-divisions-of-China）
 */
import { pcaTextArr } from 'element-china-area-data'

/** Cascader 选项类型 */
export interface RegionOption {
  value: string
  label: string
  children?: RegionOption[]
}

/** 省市区三级联动选项，可直接作为 Ant Design Cascader 的 options */
export const PCA_OPTIONS: RegionOption[] = pcaTextArr as RegionOption[]

/** 将已选路径数组转为存储用字符串（如 "北京市/市辖区/朝阳区"） */
export function regionPathToString(path: string[] | string | undefined): string {
  if (path == null) return ''
  if (Array.isArray(path)) return path.filter(Boolean).join('/')
  return String(path)
}

/** 将存储的字符串转为 Cascader 的 value 数组 */
export function stringToRegionPath(s: string | undefined): string[] {
  if (s == null || s === '') return []
  return s.split('/').filter(Boolean)
}
