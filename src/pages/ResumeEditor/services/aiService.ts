// AI service for resume content extraction
// Uses AI to parse uploaded file content into structured resume data

import type { ResumeData } from '../types'

export interface AIResumeConfig {
  provider: 'openai' | 'deepseek' | 'custom'
  apiKey: string
  baseUrl?: string
  model: string
}

const RESUME_EXTRACT_PROMPT = `你是一个专业的简历解析助手。请将以下内容解析为结构化的简历数据。

请严格按照以下 JSON 格式返回数据，不要包含任何其他文字说明：

{
  "basic": {
    "name": "姓名",
    "title": "职位/头衔",
    "email": "邮箱",
    "phone": "电话",
    "location": "所在地",
    "birthDate": "出生日期（如有）",
    "employementStatus": "求职状态（如有）"
  },
  "education": [
    {
      "school": "学校名称",
      "major": "专业",
      "degree": "学位",
      "startDate": "开始时间",
      "endDate": "结束时间",
      "gpa": "GPA（如有）",
      "description": "描述（如有）"
    }
  ],
  "experience": [
    {
      "company": "公司名称",
      "position": "职位",
      "date": "时间范围（如：2022.03 - 至今）",
      "details": "工作描述和成就"
    }
  ],
  "projects": [
    {
      "name": "项目名称",
      "role": "担任角色",
      "date": "时间范围",
      "description": "项目描述",
      "link": "项目链接（如有）"
    }
  ],
  "skillContent": "技能列表（用换行或逗号分隔）",
  "selfEvaluationContent": "自我评价/个人简介"
}

注意：
1. 如果某些字段在内容中没有提到，请留空字符串
2. 时间格式尽量统一为 "YYYY.MM" 或 "YYYY-MM" 或 "YYYY年MM月"
3. 请尽量从内容中提取所有相关信息
4. 如果内容不是简历格式，请尽量按简历结构整理
5. 工作描述请保留详细内容，包括职责和成就
6. 技能部分请用换行符分隔每个技能`

interface AIProviderConfig {
  getUrl: (baseUrl?: string) => string
  getHeaders: (apiKey: string) => Record<string, string>
  defaultModel: string
}

type UnknownRecord = Record<string, unknown>

function asRecord(value: unknown): UnknownRecord | null {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as UnknownRecord
  }
  return null
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

const AI_PROVIDERS: Record<string, AIProviderConfig> = {
  openai: {
    getUrl: baseUrl =>
      `${(baseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '')}/chat/completions`,
    getHeaders: apiKey => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    }),
    defaultModel: 'gpt-4o-mini',
  },
  deepseek: {
    getUrl: () => 'https://api.deepseek.com/v1/chat/completions',
    getHeaders: apiKey => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    }),
    defaultModel: 'deepseek-chat',
  },
  custom: {
    getUrl: baseUrl => `${(baseUrl || '').replace(/\/+$/, '')}/chat/completions`,
    getHeaders: apiKey => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    }),
    defaultModel: '',
  },
}

/**
 * Parse resume content using AI
 */
export async function parseResumeWithAI(
  config: AIResumeConfig,
  content: string,
  fileType: string
): Promise<Partial<ResumeData>> {
  const provider = AI_PROVIDERS[config.provider] || AI_PROVIDERS.openai
  const url = provider.getUrl(config.baseUrl)
  const headers = provider.getHeaders(config.apiKey)
  const model = config.model || provider.defaultModel

  const systemPrompt =
    fileType === 'json'
      ? RESUME_EXTRACT_PROMPT +
        '\n\n注意：输入内容是 JSON 格式，请解析其中的数据并按上述格式重新组织。'
      : RESUME_EXTRACT_PROMPT

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `请解析以下简历内容：\n\n${content}` },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.error?.message || `AI 请求失败: ${response.status}`)
  }

  const data = await response.json()
  const aiContent = data.choices?.[0]?.message?.content

  if (!aiContent) {
    throw new Error('AI 未返回有效内容')
  }

  return extractResumeDataFromAI(aiContent)
}

/**
 * Extract resume data from AI response
 */
function extractResumeDataFromAI(content: string): Partial<ResumeData> {
  // Try to parse JSON from the response
  let jsonData: unknown = null

  // Try direct JSON parse
  try {
    jsonData = JSON.parse(content)
  } catch {
    // Try to extract JSON from markdown code block
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      try {
        jsonData = JSON.parse(jsonMatch[1].trim())
      } catch {
        // Continue
      }
    }

    // Try to find JSON object in the content
    if (!jsonData) {
      const start = content.indexOf('{')
      const end = content.lastIndexOf('}')
      if (start !== -1 && end !== -1) {
        try {
          jsonData = JSON.parse(content.slice(start, end + 1))
        } catch {
          // Continue
        }
      }
    }
  }

  if (!jsonData) {
    throw new Error('无法从 AI 响应中提取有效的简历数据')
  }

  // Map AI response to ResumeData structure
  return mapToResumeData(jsonData)
}

/**
 * Map parsed JSON to ResumeData structure
 */
function mapToResumeData(data: unknown): Partial<ResumeData> {
  const record = asRecord(data)
  if (!record) {
    return {}
  }

  const result: Partial<ResumeData> = {}

  // Map basic info
  const basicData =
    asRecord(record.basic) || asRecord(record.personalInfo) || asRecord(record.personal)
  if (basicData) {
    result.basic = {
      name: asString(basicData.name),
      title: asString(basicData.title) || asString(basicData.position),
      email: asString(basicData.email),
      phone: asString(basicData.phone) || asString(basicData.tel),
      location: asString(basicData.location) || asString(basicData.address),
      birthDate: asString(basicData.birthDate) || asString(basicData.birthday),
      employementStatus: asString(basicData.employementStatus) || asString(basicData.status),
      photo: '',
      photoConfig: {
        width: 90,
        height: 120,
        aspectRatio: '1:1',
        borderRadius: 'none',
        customBorderRadius: 0,
        visible: true,
      },
      customFields: [],
      layout: 'left',
    }
  }

  // Map education
  if (Array.isArray(record.education)) {
    result.education = record.education.map((item, index) => {
      const edu = asRecord(item) || {}
      return {
        id: `edu_${Date.now()}_${index}`,
        school: asString(edu.school) || asString(edu.institution),
        major: asString(edu.major) || asString(edu.field) || asString(edu.specialty),
        degree: asString(edu.degree),
        startDate: asString(edu.startDate) || asString(edu.start),
        endDate: asString(edu.endDate) || asString(edu.end),
        gpa: asString(edu.gpa) || asString(edu.GPA),
        description: asString(edu.description) || asString(edu.desc),
        visible: true,
      }
    })
  }

  // Map experience
  if (Array.isArray(record.experience)) {
    result.experience = record.experience.map((item, index) => {
      const exp = asRecord(item) || {}
      const startDate = asString(exp.startDate)
      const endDate = asString(exp.endDate)
      return {
        id: `exp_${Date.now()}_${index}`,
        company: asString(exp.company) || asString(exp.organization),
        position: asString(exp.position) || asString(exp.title) || asString(exp.role),
        date: asString(exp.date) || (startDate && endDate ? `${startDate} - ${endDate}` : ''),
        details:
          asString(exp.details) || asString(exp.description) || asString(exp.responsibilities),
        visible: true,
      }
    })
  }

  // Map projects
  if (Array.isArray(record.projects)) {
    result.projects = record.projects.map((item, index) => {
      const proj = asRecord(item) || {}
      const startDate = asString(proj.startDate)
      const endDate = asString(proj.endDate)
      return {
        id: `proj_${Date.now()}_${index}`,
        name: asString(proj.name) || asString(proj.title),
        role: asString(proj.role) || asString(proj.position),
        date: asString(proj.date) || (startDate && endDate ? `${startDate} - ${endDate}` : ''),
        description: asString(proj.description) || asString(proj.details),
        visible: true,
        link: asString(proj.link) || asString(proj.url),
        linkLabel: asString(proj.linkLabel) || '查看项目',
      }
    })
  }

  // Map skills
  if (record.skills || record.skillContent) {
    if (Array.isArray(record.skills)) {
      result.skillContent = record.skills.map(item => asString(item)).join('\n')
    } else if (typeof record.skillContent === 'string') {
      result.skillContent = record.skillContent
    }
  }

  // Map self evaluation
  const selfEvaluation =
    asString(record.selfEvaluationContent) ||
    asString(record.summary) ||
    asString(record.objective) ||
    asString(record.about)
  if (selfEvaluation) {
    result.selfEvaluationContent = selfEvaluation
  }

  return result
}

/**
 * Get saved AI config from localStorage
 */
export function getSavedAIConfig(): AIResumeConfig | null {
  try {
    const saved = localStorage.getItem('ai-resume-config')
    if (saved) {
      const config = JSON.parse(saved)
      return {
        provider: config.provider || 'openai',
        apiKey: config.apiKey || '',
        baseUrl: config.baseUrl,
        model: config.model || '',
      }
    }
  } catch {
    // Ignore
  }
  return null
}

/**
 * Save AI config to localStorage
 */
export function saveAIConfig(config: AIResumeConfig): void {
  localStorage.setItem('ai-resume-config', JSON.stringify(config))
}
