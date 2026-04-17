import type { CompressType } from '@/types'
import { message } from 'antd'
import { COMPRESS_TYPE } from '@/constants'

/** 根据代码内容简单推断类型（用于格式化时自动选择） */
export const detectCodeType = (code: string): CompressType => {
  const trimmed = code.trim()
  if (!trimmed) return COMPRESS_TYPE.JSON
  const first = trimmed[0]
  if (first === '{' || first === '[') {
    try {
      JSON.parse(trimmed)
      return COMPRESS_TYPE.JSON
    } catch {
      // 可能是 JS 对象字面量
    }
  }
  if (/<\s*(\w+|!DOCTYPE|html)/i.test(trimmed)) return COMPRESS_TYPE.HTML
  if (
    /(\{[^}]*:[^}]*\}|@media|@keyframes|\.\w+\s*\{|#\w+\s*\{)/i.test(trimmed) &&
    !trimmed.includes('function') &&
    !trimmed.includes('=>')
  ) {
    return COMPRESS_TYPE.CSS
  }
  return COMPRESS_TYPE.JS
}

/** 按类型格式化代码 */
export const formatCodeByType = (code: string, type: CompressType): string => {
  const trimmed = code.trim()
  if (!trimmed) return ''

  switch (type) {
    case COMPRESS_TYPE.JSON: {
      try {
        const parsed = JSON.parse(trimmed)
        return JSON.stringify(parsed, null, 2)
      } catch {
        message.error('无效的 JSON，无法格式化')
        return code
      }
    }
    case COMPRESS_TYPE.CSS: {
      let out = ''
      let depth = 0
      const indent = () => '  '.repeat(depth)
      const lines = trimmed
        .replace(/\s*\{\s*/g, ' {\n')
        .replace(/\s*\}\s*/g, '\n}\n')
        .split('\n')
      for (const line of lines) {
        const t = line.trim()
        if (!t) continue
        if (t === '}') {
          depth = Math.max(0, depth - 1)
          out += indent() + t + '\n'
        } else if (t.endsWith('{')) {
          out += indent() + t + '\n'
          depth++
        } else {
          out += indent() + t + '\n'
        }
      }
      return out.trimEnd()
    }
    case COMPRESS_TYPE.HTML: {
      let out = ''
      let depth = 0
      const indent = () => '  '.repeat(depth)
      const parts = trimmed.replace(/>\s*</g, '>\n<').split('\n')
      const selfCloseTags = /^<(area|base|br|col|embed|hr|img|input|link|meta|param)\s/i
      for (const part of parts) {
        const line = part.trim()
        if (!line) continue
        const isClosing = /^<\s*\//.test(line)
        const isSelfClose = /\/\s*>$/.test(line) || selfCloseTags.test(line)
        if (isClosing) depth = Math.max(0, depth - 1)
        out += indent() + line + '\n'
        if (!isClosing && !isSelfClose && /<[a-z][\w-]*/i.test(line)) depth++
      }
      return out.trimEnd()
    }
    case COMPRESS_TYPE.JS: {
      let out = ''
      let depth = 0
      const indent = () => '  '.repeat(depth)
      const normalized = trimmed
        .replace(/\s*\{\s*/g, ' {\n')
        .replace(/\s*\}\s*/g, '\n}\n')
        .replace(/\s*;\s*([^\s])/g, ';\n$1')
      const lines = normalized.split('\n')
      for (const line of lines) {
        const t = line.trim()
        if (!t) continue
        if (t === '}' || t === '};') {
          depth = Math.max(0, depth - 1)
          out += indent() + t + '\n'
        } else if (t.endsWith('{')) {
          out += indent() + t + '\n'
          depth++
        } else {
          out += indent() + t + '\n'
        }
      }
      return out.trimEnd()
    }
    default:
      return code
  }
}
