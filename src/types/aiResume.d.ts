/**
 * AI 简历生成器类型定义
 */

/** 个人信息 */
export interface ResumePersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  website?: string
  linkedin?: string
  github?: string
  avatar?: string
}

/** 工作经历 */
export interface ResumeExperience {
  company: string
  position: string
  startDate: string
  endDate: string
  location?: string
  description: string
  highlights: string[]
}

/** 教育背景 */
export interface ResumeEducation {
  school: string
  degree: string
  major: string
  startDate: string
  endDate: string
  gpa?: string
  highlights?: string[]
}

/** 项目经历 */
export interface ResumeProject {
  name: string
  role: string
  startDate: string
  endDate: string
  description: string
  highlights: string[]
  technologies?: string[]
  link?: string
}

/** 自定义段落 */
export interface ResumeCustomSection {
  title: string
  content: string
}

/** 简历数据 */
export interface ResumeData {
  personalInfo: ResumePersonalInfo
  summary: string
  experience: ResumeExperience[]
  education: ResumeEducation[]
  skills: string[]
  projects: ResumeProject[]
  certifications?: string[]
  languages?: string[]
  customSections?: ResumeCustomSection[]
}

/** 简历模板样式类型 */
export type ResumeTemplateStyle = 'classic' | 'modern' | 'creative' | 'minimal' | 'sidebar'

/** 简历模板 */
export interface ResumeTemplate {
  id: string
  name: string
  description: string
  category: string
  style: ResumeTemplateStyle
  primaryColor: string
  secondaryColor: string
  fontFamily: string
}

/** 简历列表项 */
export interface ResumeItem {
  id: string
  name: string
  templateId: string
  markdownContent: string
  resumeData: ResumeData | null
  createdAt: number
  updatedAt: number
}

/** AI 配置 */
export interface ResumeAIConfig {
  provider: 'openai' | 'deepseek' | 'custom'
  apiKey: string
  model: string
  baseUrl?: string
}

/** AI 提供商配置 */
export interface ResumeAIProviderConfig {
  id: string
  name: string
  models: string[]
  defaultModel: string
  baseUrl: string
  placeholder: string
}

/** 模型信息 */
export interface ResumeModelInfo {
  id: string
  owned_by?: string
}
