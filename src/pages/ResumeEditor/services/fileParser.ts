// File parser service for resume import
// Supports: JSON, PDF, Word (.docx), Markdown (.md)

import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export interface ParsedFileContent {
  text: string
  fileType: string
  fileName: string
}

/**
 * Parse a file and extract text content
 */
export async function parseFile(file: File): Promise<ParsedFileContent> {
  const fileName = file.name
  const extension = fileName.toLowerCase().split('.').pop() || ''

  let text = ''
  let fileType = ''

  switch (extension) {
    case 'json':
      text = await parseJsonFile(file)
      fileType = 'json'
      break
    case 'pdf':
      text = await parsePdfFile(file)
      fileType = 'pdf'
      break
    case 'docx':
    case 'doc':
      text = await parseWordFile(file)
      fileType = 'word'
      break
    case 'md':
    case 'markdown':
      text = await parseMarkdownFile(file)
      fileType = 'markdown'
      break
    case 'txt':
      text = await parseTextFile(file)
      fileType = 'text'
      break
    default:
      throw new Error(`不支持的文件格式: .${extension}。支持的格式: JSON, PDF, Word, Markdown, TXT`)
  }

  if (!text.trim()) {
    throw new Error('文件内容为空')
  }

  return { text, fileType, fileName }
}

/**
 * Parse JSON file - try to extract resume data directly or as text
 */
async function parseJsonFile(file: File): Promise<string> {
  const content = await readFileAsText(file)

  try {
    const data = JSON.parse(content)

    // Check if it's already a resume data structure
    if (isResumeData(data)) {
      // Return the JSON string for direct import
      return JSON.stringify(data, null, 2)
    }

    // Otherwise convert to readable text
    return jsonToReadableText(data)
  } catch {
    // If JSON parsing fails, return as plain text
    return content
  }
}

/**
 * Check if JSON data has resume-like structure
 */
function isResumeData(data: unknown): data is Record<string, unknown> {
  if (typeof data !== 'object' || data === null) return false

  // Check for common resume fields
  const resumeFields = [
    'basic',
    'personalInfo',
    'name',
    'title',
    'email',
    'experience',
    'education',
    'skills',
  ]
  const dataKeys = Object.keys(data)

  return resumeFields.some(field => dataKeys.includes(field))
}

/**
 * Convert JSON object to readable text for AI parsing
 */
function jsonToReadableText(data: unknown, prefix = ''): string {
  if (typeof data === 'string') return data
  if (typeof data === 'number' || typeof data === 'boolean') return String(data)
  if (Array.isArray(data)) {
    return data
      .map((item, index) => `${prefix}${index + 1}. ${jsonToReadableText(item, prefix)}`)
      .join('\n')
  }
  if (typeof data === 'object' && data !== null) {
    return Object.entries(data)
      .map(([key, value]) => {
        const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
        if (typeof value === 'object' && value !== null) {
          return `${prefix}${label}:\n${jsonToReadableText(value, prefix + '  ')}`
        }
        return `${prefix}${label}: ${value}`
      })
      .join('\n')
  }
  return String(data)
}

/**
 * Parse PDF file using pdf.js
 */
async function parsePdfFile(file: File): Promise<string> {
  const arrayBuffer = await readFileAsArrayBuffer(file)

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const textParts: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map(item => ('str' in item ? String(item.str) : ''))
      .join(' ')

    if (pageText.trim()) {
      textParts.push(pageText)
    }
  }

  return textParts.join('\n\n')
}

/**
 * Parse Word document using mammoth
 */
async function parseWordFile(file: File): Promise<string> {
  const arrayBuffer = await readFileAsArrayBuffer(file)

  const result = await mammoth.extractRawText({ arrayBuffer })

  if (result.messages.length > 0) {
    console.warn('Word parsing warnings:', result.messages)
  }

  return result.value
}

/**
 * Parse Markdown file
 */
async function parseMarkdownFile(file: File): Promise<string> {
  return readFileAsText(file)
}

/**
 * Parse plain text file
 */
async function parseTextFile(file: File): Promise<string> {
  return readFileAsText(file)
}

/**
 * Read file as text
 */
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsText(file)
  })
}

/**
 * Read file as ArrayBuffer
 */
function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Get file icon based on extension
 */
export function getFileIcon(fileName: string): string {
  const ext = fileName.toLowerCase().split('.').pop() || ''
  switch (ext) {
    case 'json':
      return '📄'
    case 'pdf':
      return '📕'
    case 'docx':
    case 'doc':
      return '📘'
    case 'md':
    case 'markdown':
      return '📝'
    case 'txt':
      return '📃'
    default:
      return '📎'
  }
}

/**
 * Get supported file extensions string for accept attribute
 */
export function getSupportedExtensions(): string {
  return '.json,.pdf,.docx,.doc,.md,.markdown,.txt'
}
