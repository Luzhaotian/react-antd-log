// Resume Editor Types - adapted from Magic Resume

export interface PhotoConfig {
  width: number
  height: number
  aspectRatio: '1:1' | '4:3' | '3:4' | '16:9' | 'custom'
  borderRadius: 'none' | 'medium' | 'full' | 'custom'
  customBorderRadius: number
  visible?: boolean
}

export interface BasicFieldType {
  id: string
  key: keyof BasicInfo
  label: string
  type?: 'date' | 'textarea' | 'text' | 'editor'
  visible: boolean
  custom?: boolean
}

export interface CustomFieldType {
  id: string
  label: string
  value: string
  icon?: string
  visible?: boolean
  custom?: boolean
  displayLabel?: boolean
}

export interface BasicInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  birthDate: string
  employementStatus: string
  photo: string
  photoConfig: PhotoConfig
  fieldOrder?: BasicFieldType[]
  customFields: CustomFieldType[]
  layout?: 'left' | 'center' | 'right'
}

export interface Education {
  id: string
  school: string
  major: string
  degree: string
  startDate: string
  endDate: string
  gpa?: string
  description?: string
  visible?: boolean
}

export interface Experience {
  id: string
  company: string
  position: string
  date: string
  details: string
  visible?: boolean
}

export interface Skill {
  id: string
  name: string
  level: number
}

export interface Project {
  id: string
  name: string
  role: string
  date: string
  description: string
  visible: boolean
  link?: string
  linkLabel?: string
}

export interface Certificate {
  id: string
  url: string
  width: number
}

export interface CustomItem {
  id: string
  title: string
  subtitle: string
  dateRange: string
  description: string
  visible: boolean
}

export interface MenuSection {
  id: string
  title: string
  icon: string
  enabled: boolean
  order: number
}

export type GlobalSettings = {
  themeColor?: string | undefined
  fontFamily?: string | undefined
  baseFontSize?: number | undefined
  pagePadding?: number | undefined
  paragraphSpacing?: number | undefined
  lineHeight?: number | undefined
  sectionSpacing?: number | undefined
  headerSize?: number | undefined
  subheaderSize?: number | undefined
  useIconMode?: boolean | undefined
  centerSubtitle?: boolean | undefined
  flexibleHeaderLayout?: boolean | undefined
  autoOnePage?: boolean | undefined
}

export interface ResumeData {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  templateId: string | null | undefined
  basic: BasicInfo
  education: Education[]
  experience: Experience[]
  projects: Project[]
  certificates: Certificate[]
  customData: Record<string, CustomItem[]>
  skillContent: string
  selfEvaluationContent: string
  activeSection: string
  menuSections: MenuSection[]
  globalSettings: GlobalSettings
}

export interface ResumeTemplate {
  id: string
  name: string
  description: string
  thumbnail: string
  layout: string
  colorScheme: {
    primary: string
    secondary: string
    background: string
    text: string
  }
  spacing: {
    sectionGap: number
    itemGap: number
    contentPadding: number
  }
  basic: {
    layout?: 'left' | 'center' | 'right'
  }
  availableSections?: string[]
}

export interface ResumeModule {
  id: string
  titleKey: string
  icon: string
}

export const DEFAULT_PHOTO_CONFIG: PhotoConfig = {
  width: 90,
  height: 120,
  aspectRatio: '1:1',
  borderRadius: 'none',
  customBorderRadius: 0,
  visible: true,
}

export const STANDARD_MODULES: Record<string, ResumeModule> = {
  skills: { id: 'skills', titleKey: 'skills', icon: '⚡' },
  experience: { id: 'experience', titleKey: 'experience', icon: '💼' },
  projects: { id: 'projects', titleKey: 'projects', icon: '🚀' },
  education: { id: 'education', titleKey: 'education', icon: '🎓' },
  selfEvaluation: { id: 'selfEvaluation', titleKey: 'selfEvaluation', icon: '💬' },
  certificates: { id: 'certificates', titleKey: 'certificates', icon: '🏆' },
}

export const THEME_COLORS = [
  '#000000',
  '#1A1A1A',
  '#333333',
  '#4D4D4D',
  '#666666',
  '#808080',
  '#999999',
  '#0047AB',
  '#8B0000',
  '#FF4500',
  '#4B0082',
  '#2E8B57',
]
