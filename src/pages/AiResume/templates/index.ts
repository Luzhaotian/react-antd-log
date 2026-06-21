import type { ResumeTemplate } from '@/types'

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'classic',
    name: '经典专业',
    description: '传统专业的简历布局，适合金融、法律、咨询等行业',
    thumbnail: 'classic',
    style: 'classic',
    primaryColor: '#1a365d',
    secondaryColor: '#2d3748',
    fontFamily: "'Noto Sans SC', 'Helvetica Neue', Arial, sans-serif",
  },
  {
    id: 'modern',
    name: '现代简约',
    description: '简洁现代的设计风格，适合互联网、科技等行业',
    thumbnail: 'modern',
    style: 'modern',
    primaryColor: '#0066ff',
    secondaryColor: '#4a5568',
    fontFamily: "'Noto Sans SC', 'SF Pro Display', -apple-system, sans-serif",
  },
  {
    id: 'creative',
    name: '创意设计',
    description: '富有创意的排版设计，适合设计、媒体、营销等行业',
    thumbnail: 'creative',
    style: 'creative',
    primaryColor: '#e53e3e',
    secondaryColor: '#742a2a',
    fontFamily: "'Noto Sans SC', 'Georgia', serif",
  },
  {
    id: 'minimal',
    name: '极简风格',
    description: '极简主义设计，突出内容本身，适合技术岗位',
    thumbnail: 'minimal',
    style: 'minimal',
    primaryColor: '#000000',
    secondaryColor: '#666666',
    fontFamily: "'Noto Sans SC', 'Menlo', 'Consolas', monospace",
  },
]

export const getResumeTemplateById = (id: string): ResumeTemplate => {
  return resumeTemplates.find(t => t.id === id) || resumeTemplates[0]
}
