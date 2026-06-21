import type { ResumeTemplate } from '../types'

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'classic',
    name: '经典专业',
    description: '传统单栏布局，稳重大气，适合金融、法律、咨询等行业',
    thumbnail: '',
    layout: 'single-column',
    colorScheme: {
      primary: '#1a365d',
      secondary: '#2d3748',
      background: '#ffffff',
      text: '#333333',
    },
    spacing: {
      sectionGap: 16,
      itemGap: 12,
      contentPadding: 20,
    },
    basic: {
      layout: 'center',
    },
  },
  {
    id: 'modern',
    name: '现代简约',
    description: '简洁现代的设计，适合互联网、科技等行业',
    thumbnail: '',
    layout: 'single-column',
    colorScheme: {
      primary: '#0066ff',
      secondary: '#00c6ff',
      background: '#ffffff',
      text: '#333333',
    },
    spacing: {
      sectionGap: 20,
      itemGap: 16,
      contentPadding: 24,
    },
    basic: {
      layout: 'left',
    },
  },
  {
    id: 'sidebar',
    name: '侧边栏布局',
    description: '左侧深色栏放个人信息，右侧展示经历，清晰有层次',
    thumbnail: '',
    layout: 'sidebar',
    colorScheme: {
      primary: '#2b6cb0',
      secondary: '#4a5568',
      background: '#ffffff',
      text: '#333333',
    },
    spacing: {
      sectionGap: 16,
      itemGap: 12,
      contentPadding: 20,
    },
    basic: {
      layout: 'left',
    },
  },
  {
    id: 'creative',
    name: '创意时间轴',
    description: '时间轴风格，适合展示职业发展历程',
    thumbnail: '',
    layout: 'timeline',
    colorScheme: {
      primary: '#e53e3e',
      secondary: '#742a2a',
      background: '#ffffff',
      text: '#333333',
    },
    spacing: {
      sectionGap: 20,
      itemGap: 16,
      contentPadding: 24,
    },
    basic: {
      layout: 'left',
    },
  },
  {
    id: 'minimal',
    name: '极简风格',
    description: '极简设计，突出内容，适合设计师、创意人员',
    thumbnail: '',
    layout: 'cards',
    colorScheme: {
      primary: '#6b46c1',
      secondary: '#553c9a',
      background: '#ffffff',
      text: '#333333',
    },
    spacing: {
      sectionGap: 16,
      itemGap: 12,
      contentPadding: 20,
    },
    basic: {
      layout: 'center',
    },
  },
  {
    id: 'elegant',
    name: '优雅学术',
    description: '优雅衬线字体，适合科研、医疗、教育行业',
    thumbnail: '',
    layout: 'single-column',
    colorScheme: {
      primary: '#553c9a',
      secondary: '#6b46c1',
      background: '#ffffff',
      text: '#333333',
    },
    spacing: {
      sectionGap: 16,
      itemGap: 12,
      contentPadding: 20,
    },
    basic: {
      layout: 'center',
    },
  },
]

export function getResumeTemplateById(id: string): ResumeTemplate {
  return resumeTemplates.find(t => t.id === id) || resumeTemplates[0]
}
