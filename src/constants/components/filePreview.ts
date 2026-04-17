import type { PreviewType } from '@/types'

/** 预览类型 */
export const PREVIEW_TYPE = {
  IMAGE: 'image',
  PDF: 'pdf',
  VIDEO: 'video',
  AUDIO: 'audio',
  EXCEL: 'excel',
  WORD: 'word',
} as const

/** 扩展名到预览类型的映射 */
export const EXT_TO_TYPE: Record<string, PreviewType> = {
  pdf: 'pdf',
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  gif: 'image',
  webp: 'image',
  svg: 'image',
  bmp: 'image',
  avif: 'image',
  mp4: 'video',
  webm: 'video',
  mov: 'video',
  mp3: 'audio',
  aac: 'audio',
  ogg: 'audio',
  flac: 'audio',
  wav: 'audio',
  xlsx: 'excel',
  xls: 'excel',
  docx: 'word',
}

/** 图片类型 */
export const IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/avif',
]

/** PDF 类型 */
export const PDF_TYPES = ['application/pdf']

/** 视频类型 */
export const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']

/** 音频类型 */
export const AUDIO_TYPES = [
  'audio/mpeg',
  'audio/aac',
  'audio/ogg',
  'audio/flac',
  'audio/wav',
  'audio/webm',
]

/** Excel 类型 */
export const EXCEL_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
  'application/vnd.ms-excel',
]

/** Word 类型 */
export const WORD_TYPES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
]

/** 预览类型标签 */
export const PREVIEW_TYPE_LABEL: Record<Exclude<PreviewType, null>, string> = {
  [PREVIEW_TYPE.IMAGE]: '图片',
  [PREVIEW_TYPE.PDF]: 'PDF',
  [PREVIEW_TYPE.VIDEO]: '视频',
  [PREVIEW_TYPE.AUDIO]: '音频',
  [PREVIEW_TYPE.EXCEL]: 'Excel',
  [PREVIEW_TYPE.WORD]: 'Word',
}
