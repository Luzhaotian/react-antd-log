/** 选项类型 */
export interface Option<
  T extends string | number | boolean | undefined,
  L extends string | number | undefined,
> {
  /** 选项值 */
  value: T
  /** 选项标签 */
  label: L
}

/** 选择器类型（与 constants/common PICKER_TYPE 一致） */
export type PickerType = 'month' | 'day' | 'week' | 'year' | 'quarter'
