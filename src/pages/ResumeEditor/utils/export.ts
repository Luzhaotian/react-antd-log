import type { ResumeData } from '../types'
import { getResumeTemplateById } from '../templates'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderBasicSection(basic: ResumeData['basic'], primaryColor: string): string {
  const fields: string[] = []

  if (basic.name) {
    fields.push(
      `<h1 style="font-size:28px;color:${primaryColor};margin:0 0 4px">${escapeHtml(basic.name)}</h1>`
    )
  }
  if (basic.title) {
    fields.push(
      `<p style="font-size:16px;color:#666;margin:0 0 12px">${escapeHtml(basic.title)}</p>`
    )
  }

  const contactItems: string[] = []
  if (basic.email) contactItems.push(`📧 ${escapeHtml(basic.email)}`)
  if (basic.phone) contactItems.push(`📱 ${escapeHtml(basic.phone)}`)
  if (basic.location) contactItems.push(`📍 ${escapeHtml(basic.location)}`)

  if (contactItems.length > 0) {
    fields.push(
      `<div style="font-size:13px;color:#666">${contactItems.join(' &nbsp;·&nbsp; ')}</div>`
    )
  }

  return `<header style="text-align:${basic.layout === 'left' ? 'left' : 'center'};border-bottom:2px solid ${primaryColor};padding-bottom:12px;margin-bottom:16px">${fields.join('')}</header>`
}

function renderEducationSection(education: ResumeData['education'], primaryColor: string): string {
  if (!education.length) return ''
  const items = education
    .filter(e => e.visible !== false)
    .map(
      e => `
    <div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <b>${escapeHtml(e.school)}</b>
          ${e.degree ? ` · ${escapeHtml(e.degree)}` : ''}
          ${e.major ? ` · ${escapeHtml(e.major)}` : ''}
        </div>
        <span style="font-size:12px;color:#888;white-space:nowrap">${escapeHtml(e.startDate)} - ${escapeHtml(e.endDate)}</span>
      </div>
      ${e.gpa ? `<div style="font-size:13px;color:#666">GPA: ${escapeHtml(e.gpa)}</div>` : ''}
      ${e.description ? `<div style="font-size:13px;color:#555;margin-top:4px">${escapeHtml(e.description)}</div>` : ''}
    </div>
  `
    )
    .join('')

  return `<div style="margin-bottom:16px"><h2 style="font-size:16px;font-weight:700;color:${primaryColor};text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid ${primaryColor};padding-bottom:4px;margin-bottom:12px">教育背景</h2>${items}</div>`
}

function renderExperienceSection(
  experience: ResumeData['experience'],
  primaryColor: string
): string {
  if (!experience.length) return ''
  const items = experience
    .filter(e => e.visible !== false)
    .map(
      e => `
    <div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <b>${escapeHtml(e.position)}</b>
          ${e.company ? ` · ${escapeHtml(e.company)}` : ''}
        </div>
        <span style="font-size:12px;color:#888;white-space:nowrap">${escapeHtml(e.date)}</span>
      </div>
      ${e.details ? `<div style="font-size:13px;color:#555;margin-top:4px;white-space:pre-line">${escapeHtml(e.details)}</div>` : ''}
    </div>
  `
    )
    .join('')

  return `<div style="margin-bottom:16px"><h2 style="font-size:16px;font-weight:700;color:${primaryColor};text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid ${primaryColor};padding-bottom:4px;margin-bottom:12px">工作经历</h2>${items}</div>`
}

function renderProjectsSection(projects: ResumeData['projects'], primaryColor: string): string {
  if (!projects.length) return ''
  const items = projects
    .filter(p => p.visible)
    .map(
      p => `
    <div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <b>${escapeHtml(p.name)}</b>
          ${p.role ? ` · ${escapeHtml(p.role)}` : ''}
        </div>
        <span style="font-size:12px;color:#888;white-space:nowrap">${escapeHtml(p.date)}</span>
      </div>
      ${p.description ? `<div style="font-size:13px;color:#555;margin-top:4px;white-space:pre-line">${escapeHtml(p.description)}</div>` : ''}
      ${p.link ? `<div style="font-size:12px;margin-top:4px"><a href="${escapeHtml(p.link)}" style="color:${primaryColor}">${p.linkLabel || '查看项目'}</a></div>` : ''}
    </div>
  `
    )
    .join('')

  return `<div style="margin-bottom:16px"><h2 style="font-size:16px;font-weight:700;color:${primaryColor};text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid ${primaryColor};padding-bottom:4px;margin-bottom:12px">项目经历</h2>${items}</div>`
}

function renderSkillsSection(skillContent: string, primaryColor: string): string {
  if (!skillContent) return ''
  return `<div style="margin-bottom:16px"><h2 style="font-size:16px;font-weight:700;color:${primaryColor};text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid ${primaryColor};padding-bottom:4px;margin-bottom:12px">专业技能</h2><div style="font-size:14px;color:#555;line-height:1.8;white-space:pre-line">${escapeHtml(skillContent)}</div></div>`
}

function renderSelfEvaluationSection(content: string, primaryColor: string): string {
  if (!content) return ''
  return `<div style="margin-bottom:16px"><h2 style="font-size:16px;font-weight:700;color:${primaryColor};text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid ${primaryColor};padding-bottom:4px;margin-bottom:12px">自我评价</h2><div style="font-size:14px;color:#555;line-height:1.8;white-space:pre-line">${escapeHtml(content)}</div></div>`
}

export function renderResumeToHtml(resume: ResumeData): string {
  const template = getResumeTemplateById(resume.templateId || 'classic')
  const primaryColor = template.colorScheme.primary
  const settings = resume.globalSettings

  const sections: string[] = []

  // Basic info header
  sections.push(renderBasicSection(resume.basic, primaryColor))

  // Render sections based on menu order
  const enabledSections = resume.menuSections
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order)

  for (const section of enabledSections) {
    switch (section.id) {
      case 'basic':
        // Already rendered as header
        break
      case 'education':
        sections.push(renderEducationSection(resume.education, primaryColor))
        break
      case 'experience':
        sections.push(renderExperienceSection(resume.experience, primaryColor))
        break
      case 'projects':
        sections.push(renderProjectsSection(resume.projects, primaryColor))
        break
      case 'skills':
        sections.push(renderSkillsSection(resume.skillContent, primaryColor))
        break
      case 'selfEvaluation':
        sections.push(renderSelfEvaluationSection(resume.selfEvaluationContent, primaryColor))
        break
    }
  }

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: ${settings.fontFamily || "'Noto Sans SC', sans-serif"};
      color: #333;
      line-height: ${settings.lineHeight || 1.6};
      font-size: ${settings.baseFontSize || 14}px;
      max-width: 800px;
      margin: 0 auto;
      padding: ${settings.pagePadding || 20}px;
      background: #fff;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  ${sections.join('')}
</body>
</html>`
}

export async function exportToPdf(resume: ResumeData): Promise<void> {
  const html = renderResumeToHtml(resume)

  // Create a temporary iframe to render the HTML
  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.left = '-9999px'
  iframe.style.width = '210mm'
  iframe.style.height = '297mm'
  document.body.appendChild(iframe)

  const doc = iframe.contentDocument || iframe.contentWindow?.document
  if (!doc) {
    document.body.removeChild(iframe)
    throw new Error('无法创建打印文档')
  }

  doc.open()
  doc.write(html)
  doc.close()

  // Wait for content to render
  await new Promise(resolve => setTimeout(resolve, 500))

  // Trigger print
  iframe.contentWindow?.print()

  // Clean up
  setTimeout(() => {
    document.body.removeChild(iframe)
  }, 1000)
}

export function exportToJson(resume: ResumeData): void {
  const json = JSON.stringify(resume, null, 2)
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${resume.title || '简历'}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export function exportToMarkdown(resume: ResumeData): string {
  const lines: string[] = []

  // Basic info
  if (resume.basic.name) lines.push(`# ${resume.basic.name}`)
  if (resume.basic.title) lines.push(`**${resume.basic.title}**`)
  lines.push('')

  const contact: string[] = []
  if (resume.basic.email) contact.push(`📧 ${resume.basic.email}`)
  if (resume.basic.phone) contact.push(`📱 ${resume.basic.phone}`)
  if (resume.basic.location) contact.push(`📍 ${resume.basic.location}`)
  if (contact.length) lines.push(contact.join(' | '))
  lines.push('')

  // Sections
  const enabledSections = resume.menuSections
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order)

  for (const section of enabledSections) {
    switch (section.id) {
      case 'education':
        if (resume.education.length) {
          lines.push('## 教育背景')
          lines.push('')
          resume.education.forEach(e => {
            if (e.visible === false) return
            lines.push(`### ${e.school}`)
            if (e.degree || e.major) lines.push(`${e.degree} · ${e.major}`)
            if (e.startDate || e.endDate) lines.push(`${e.startDate} - ${e.endDate}`)
            if (e.gpa) lines.push(`GPA: ${e.gpa}`)
            if (e.description) lines.push(e.description)
            lines.push('')
          })
        }
        break
      case 'experience':
        if (resume.experience.length) {
          lines.push('## 工作经历')
          lines.push('')
          resume.experience.forEach(e => {
            if (e.visible === false) return
            lines.push(`### ${e.position}${e.company ? ` · ${e.company}` : ''}`)
            if (e.date) lines.push(e.date)
            if (e.details) lines.push(e.details)
            lines.push('')
          })
        }
        break
      case 'projects':
        if (resume.projects.length) {
          lines.push('## 项目经历')
          lines.push('')
          resume.projects.forEach(p => {
            if (!p.visible) return
            lines.push(`### ${p.name}${p.role ? ` · ${p.role}` : ''}`)
            if (p.date) lines.push(p.date)
            if (p.description) lines.push(p.description)
            if (p.link) lines.push(`[查看项目](${p.link})`)
            lines.push('')
          })
        }
        break
      case 'skills':
        if (resume.skillContent) {
          lines.push('## 专业技能')
          lines.push('')
          lines.push(resume.skillContent)
          lines.push('')
        }
        break
      case 'selfEvaluation':
        if (resume.selfEvaluationContent) {
          lines.push('## 自我评价')
          lines.push('')
          lines.push(resume.selfEvaluationContent)
          lines.push('')
        }
        break
    }
  }

  return lines.join('\n')
}

export function exportMarkdownFile(resume: ResumeData): void {
  const md = exportToMarkdown(resume)
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${resume.title || '简历'}.md`
  link.click()
  URL.revokeObjectURL(url)
}
