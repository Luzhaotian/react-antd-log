import { describe, expect, it } from 'vitest'
import {
  getPreviewType,
  getPreviewTypeLabel,
  isSupportedPreviewFile,
} from '@/utils/components/filePreview'
import { PREVIEW_TYPE } from '@/constants'

function file(name: string, type = ''): File {
  return new File(['x'], name, { type })
}

describe('filePreview', () => {
  it('按 MIME 识别类型', () => {
    expect(getPreviewType(file('a.png', 'image/png'))).toBe(PREVIEW_TYPE.IMAGE)
    expect(getPreviewType(file('a.pdf', 'application/pdf'))).toBe(PREVIEW_TYPE.PDF)
    expect(getPreviewType(file('a.mp4', 'video/mp4'))).toBe(PREVIEW_TYPE.VIDEO)
    expect(getPreviewType(file('a.mp3', 'audio/mpeg'))).toBe(PREVIEW_TYPE.AUDIO)
  })

  it('无 MIME 时按扩展名回退', () => {
    expect(getPreviewType(file('sheet.xlsx'))).toBe(PREVIEW_TYPE.EXCEL)
    expect(getPreviewType(file('doc.docx'))).toBe(PREVIEW_TYPE.WORD)
    expect(getPreviewType(file('pic.jpg'))).toBe(PREVIEW_TYPE.IMAGE)
  })

  it('不支持的类型', () => {
    expect(getPreviewType(file('a.zip', 'application/zip'))).toBeNull()
    expect(isSupportedPreviewFile(file('a.zip', 'application/zip'))).toBe(false)
    expect(getPreviewTypeLabel(file('a.zip', 'application/zip'))).toBe('未知')
  })

  it('支持类型的中文标签', () => {
    expect(getPreviewTypeLabel(file('a.png', 'image/png'))).toBe('图片')
    expect(getPreviewTypeLabel(file('a.pdf', 'application/pdf'))).toBe('PDF')
    expect(isSupportedPreviewFile(file('a.pdf', 'application/pdf'))).toBe(true)
  })
})
