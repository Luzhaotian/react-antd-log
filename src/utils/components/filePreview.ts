import type { PreviewType } from '@/types'
import {
  IMAGE_TYPES,
  PDF_TYPES,
  VIDEO_TYPES,
  AUDIO_TYPES,
  EXCEL_TYPES,
  WORD_TYPES,
  EXT_TO_TYPE,
  PREVIEW_TYPE,
  PREVIEW_TYPE_LABEL,
} from '@/constants'

export const getPreviewType = (file: File): PreviewType => {
  if (file.type && IMAGE_TYPES.includes(file.type)) return PREVIEW_TYPE.IMAGE
  if (file.type && PDF_TYPES.includes(file.type)) return PREVIEW_TYPE.PDF
  if (file.type && VIDEO_TYPES.includes(file.type)) return PREVIEW_TYPE.VIDEO
  if (file.type && AUDIO_TYPES.includes(file.type)) return PREVIEW_TYPE.AUDIO
  if (file.type && EXCEL_TYPES.includes(file.type)) return PREVIEW_TYPE.EXCEL
  if (file.type && WORD_TYPES.includes(file.type)) return PREVIEW_TYPE.WORD
  if (!file.type && file.name) {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (ext && EXT_TO_TYPE[ext]) return EXT_TO_TYPE[ext]
  }
  return null
}

/** 是否支持预览（图片、PDF、视频、音频、Excel、Word） */
export const isSupportedPreviewFile = (file: File): boolean => {
  return getPreviewType(file) !== null
}

/** 获取文件类型展示文案（图片/PDF/视频/音频/Excel/Word/未知） */
export const getPreviewTypeLabel = (file: File): string => {
  const t = getPreviewType(file)
  return t ? PREVIEW_TYPE_LABEL[t] : '未知'
}
