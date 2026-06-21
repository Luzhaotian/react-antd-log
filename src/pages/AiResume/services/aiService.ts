import type { ResumeAIConfig, ResumeData, ResumeAIProviderConfig, ResumeModelInfo } from '@/types'

export const AI_PROVIDERS: ResumeAIProviderConfig[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    defaultModel: 'gpt-4o-mini',
    baseUrl: 'https://api.openai.com/v1',
    placeholder: 'sk-...',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    models: ['deepseek-chat', 'deepseek-coder'],
    defaultModel: 'deepseek-chat',
    baseUrl: 'https://api.deepseek.com/v1',
    placeholder: 'sk-...',
  },
  {
    id: 'custom',
    name: '自定义 (OpenAI 兼容)',
    models: ['自定义模型'],
    defaultModel: '',
    baseUrl: '',
    placeholder: '输入您的 API Key',
  },
]

const RESUME_PARSE_PROMPT = `你是一个专业的简历解析助手。请将以下 Markdown 内容解析为结构化的简历数据。

请严格按照以下 JSON 格式返回数据，不要包含任何其他文字说明：

{
  "personalInfo": {
    "name": "姓名",
    "title": "职位/头衔",
    "email": "邮箱",
    "phone": "电话",
    "location": "所在地",
    "website": "个人网站（如有）",
    "linkedin": "LinkedIn（如有）",
    "github": "GitHub（如有）"
  },
  "summary": "个人简介/自我评价",
  "experience": [
    {
      "company": "公司名称",
      "position": "职位",
      "startDate": "开始时间",
      "endDate": "结束时间",
      "location": "工作地点",
      "description": "工作描述",
      "highlights": ["工作亮点1", "工作亮点2"]
    }
  ],
  "education": [
    {
      "school": "学校名称",
      "degree": "学位",
      "major": "专业",
      "startDate": "开始时间",
      "endDate": "结束时间",
      "gpa": "GPA（如有）",
      "highlights": ["亮点1"]
    }
  ],
  "skills": ["技能1", "技能2", "技能3"],
  "projects": [
    {
      "name": "项目名称",
      "role": "担任角色",
      "startDate": "开始时间",
      "endDate": "结束时间",
      "description": "项目描述",
      "highlights": ["项目亮点1", "项目亮点2"],
      "technologies": ["技术栈1", "技术栈2"],
      "link": "项目链接（如有）"
    }
  ],
  "certifications": ["证书1"],
  "languages": ["语言1"]
}

注意：
1. 如果某些字段在 Markdown 中没有提到，请留空字符串或空数组
2. 时间格式尽量统一为 "YYYY-MM" 或 "YYYY年MM月"
3. 请尽量从内容中提取所有相关信息
4. 如果内容不是简历格式，请尽量按简历结构整理`

function getApiEndpoint(config: ResumeAIConfig): string {
  const provider = AI_PROVIDERS.find(p => p.id === config.provider)
  const baseUrl = config.baseUrl || provider?.baseUrl || ''
  return `${baseUrl}/chat/completions`
}

function buildHeaders(config: ResumeAIConfig): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.apiKey}`,
  }
}

function buildRequestBody(config: ResumeAIConfig, markdownContent: string) {
  return {
    model: config.model,
    messages: [
      {
        role: 'system',
        content: RESUME_PARSE_PROMPT,
      },
      {
        role: 'user',
        content: `请解析以下 Markdown 内容为简历数据：\n\n${markdownContent}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 4096,
  }
}

function extractJsonFromResponse(content: string): ResumeData {
  // 尝试直接解析
  try {
    return JSON.parse(content) as ResumeData
  } catch {
    // 尝试提取 JSON 块
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1].trim()) as ResumeData
    }
    // 尝试找到第一个 { 和最后一个 }
    const start = content.indexOf('{')
    const end = content.lastIndexOf('}')
    if (start !== -1 && end !== -1) {
      return JSON.parse(content.slice(start, end + 1)) as ResumeData
    }
    throw new Error('无法从 AI 响应中提取有效的 JSON 数据')
  }
}

export async function parseResumeWithAI(
  config: ResumeAIConfig,
  markdownContent: string
): Promise<ResumeData> {
  const endpoint = getApiEndpoint(config)
  const headers = buildHeaders(config)
  const body = buildRequestBody(config, markdownContent)

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      const errorMessage = errorData?.error?.message || `API 请求失败: ${response.status}`
      throw new Error(errorMessage)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('AI 未返回有效内容')
    }

    return extractJsonFromResponse(content)
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('调用 AI API 时发生未知错误')
  }
}

export async function fetchModels(apiKey: string, baseUrl: string): Promise<ResumeModelInfo[]> {
  const response = await fetch(`${baseUrl}/models`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })

  if (!response.ok) {
    const err = await response.json().catch(() => null)
    throw new Error(err?.error?.message || `获取模型列表失败: ${response.status}`)
  }

  const data = await response.json()
  // OpenAI 兼容格式: { data: [{ id: "gpt-4o", ... }] }
  const models: ResumeModelInfo[] = data.data ?? data
  // 按名称排序，过滤掉 embedding/whisper/dall-e 等非对话模型
  return models
    .filter(m => !/embedding|whisper|dall|tts|moderation|audio/i.test(m.id))
    .sort((a, b) => a.id.localeCompare(b.id))
}
