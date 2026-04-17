/** 预览类型（与 constants/components/filePreview PREVIEW_TYPE 一致） */
export type PreviewType = 'image' | 'pdf' | 'video' | 'audio' | 'excel' | 'word' | null

/** 文件预览组件 Props */
export interface FilePreviewProps {
  /** 文件 */
  file: File | null
  /** 高度 */
  height?: number | string
  /** 宽度 */
  width?: number | string
  /** 是否显示文件名 */
  showFileName?: boolean
}
