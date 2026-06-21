import type { ResumeData, ResumeTemplate } from '@/types'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderPersonalInfo(data: ResumeData): string {
  const { personalInfo } = data
  const links: string[] = []
  if (personalInfo.email)
    links.push(`<span class="contact-item">📧 ${escapeHtml(personalInfo.email)}</span>`)
  if (personalInfo.phone)
    links.push(`<span class="contact-item">📱 ${escapeHtml(personalInfo.phone)}</span>`)
  if (personalInfo.location)
    links.push(`<span class="contact-item">📍 ${escapeHtml(personalInfo.location)}</span>`)
  if (personalInfo.website)
    links.push(
      `<span class="contact-item">🌐 <a href="${escapeHtml(personalInfo.website)}">${escapeHtml(personalInfo.website)}</a></span>`
    )
  if (personalInfo.github)
    links.push(
      `<span class="contact-item">💻 <a href="${escapeHtml(personalInfo.github)}">GitHub</a></span>`
    )
  if (personalInfo.linkedin)
    links.push(
      `<span class="contact-item">🔗 <a href="${escapeHtml(personalInfo.linkedin)}">LinkedIn</a></span>`
    )

  return `
    <header class="resume-header">
      <h1 class="name">${escapeHtml(personalInfo.name)}</h1>
      ${personalInfo.title ? `<p class="title">${escapeHtml(personalInfo.title)}</p>` : ''}
      <div class="contact-info">${links.join('')}</div>
    </header>
  `
}

function renderSection(title: string, content: string): string {
  if (!content.trim()) return ''
  return `
    <section class="resume-section">
      <h2 class="section-title">${escapeHtml(title)}</h2>
      <div class="section-content">${content}</div>
    </section>
  `
}

function renderSummary(data: ResumeData): string {
  if (!data.summary) return ''
  return renderSection('个人简介', `<p class="summary-text">${escapeHtml(data.summary)}</p>`)
}

function renderExperience(data: ResumeData): string {
  if (!data.experience?.length) return ''
  const items = data.experience
    .map(
      exp => `
    <div class="experience-item">
      <div class="item-header">
        <div class="item-left">
          <h3 class="item-title">${escapeHtml(exp.position)}</h3>
          <span class="item-company">${escapeHtml(exp.company)}</span>
          ${exp.location ? `<span class="item-location">${escapeHtml(exp.location)}</span>` : ''}
        </div>
        <div class="item-right">
          <span class="item-date">${escapeHtml(exp.startDate)} - ${escapeHtml(exp.endDate)}</span>
        </div>
      </div>
      ${exp.description ? `<p class="item-description">${escapeHtml(exp.description)}</p>` : ''}
      ${
        exp.highlights?.length
          ? `<ul class="item-highlights">${exp.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}</ul>`
          : ''
      }
    </div>
  `
    )
    .join('')
  return renderSection('工作经历', items)
}

function renderEducation(data: ResumeData): string {
  if (!data.education?.length) return ''
  const items = data.education
    .map(
      edu => `
    <div class="education-item">
      <div class="item-header">
        <div class="item-left">
          <h3 class="item-title">${escapeHtml(edu.school)}</h3>
          <span class="item-degree">${escapeHtml(edu.degree)} · ${escapeHtml(edu.major)}</span>
          ${edu.gpa ? `<span class="item-gpa">GPA: ${escapeHtml(edu.gpa)}</span>` : ''}
        </div>
        <div class="item-right">
          <span class="item-date">${escapeHtml(edu.startDate)} - ${escapeHtml(edu.endDate)}</span>
        </div>
      </div>
      ${
        edu.highlights?.length
          ? `<ul class="item-highlights">${edu.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}</ul>`
          : ''
      }
    </div>
  `
    )
    .join('')
  return renderSection('教育背景', items)
}

function renderProjects(data: ResumeData): string {
  if (!data.projects?.length) return ''
  const items = data.projects
    .map(
      proj => `
    <div class="project-item">
      <div class="item-header">
        <div class="item-left">
          <h3 class="item-title">${escapeHtml(proj.name)}</h3>
          <span class="item-role">${escapeHtml(proj.role)}</span>
          ${proj.link ? `<a class="item-link" href="${escapeHtml(proj.link)}">🔗 项目链接</a>` : ''}
        </div>
        <div class="item-right">
          <span class="item-date">${escapeHtml(proj.startDate)} - ${escapeHtml(proj.endDate)}</span>
        </div>
      </div>
      ${proj.description ? `<p class="item-description">${escapeHtml(proj.description)}</p>` : ''}
      ${
        proj.technologies?.length
          ? `<div class="item-tags">${proj.technologies.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>`
          : ''
      }
      ${
        proj.highlights?.length
          ? `<ul class="item-highlights">${proj.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('')}</ul>`
          : ''
      }
    </div>
  `
    )
    .join('')
  return renderSection('项目经历', items)
}

function renderSkills(data: ResumeData): string {
  if (!data.skills?.length) return ''
  const skillsHtml = data.skills
    .map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`)
    .join('')
  return renderSection('专业技能', `<div class="skills-container">${skillsHtml}</div>`)
}

function renderCertifications(data: ResumeData): string {
  if (!data.certifications?.length) return ''
  const items = data.certifications.map(cert => `<li>${escapeHtml(cert)}</li>`).join('')
  return renderSection('证书资质', `<ul class="cert-list">${items}</ul>`)
}

function renderLanguages(data: ResumeData): string {
  if (!data.languages?.length) return ''
  const items = data.languages
    .map(lang => `<span class="skill-tag">${escapeHtml(lang)}</span>`)
    .join('')
  return renderSection('语言能力', `<div class="skills-container">${items}</div>`)
}

function generateStyles(template: ResumeTemplate): string {
  const { primaryColor, secondaryColor, fontFamily } = template

  return `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }

      .resume-container {
        font-family: ${fontFamily};
        color: #333;
        line-height: 1.6;
        max-width: 800px;
        margin: 0 auto;
        padding: 40px;
        background: #fff;
      }

      .resume-header {
        text-align: center;
        padding-bottom: 20px;
        margin-bottom: 24px;
        border-bottom: 3px solid ${primaryColor};
      }

      .name {
        font-size: 32px;
        font-weight: 700;
        color: ${primaryColor};
        margin-bottom: 4px;
        letter-spacing: 2px;
      }

      .title {
        font-size: 16px;
        color: ${secondaryColor};
        margin-bottom: 12px;
        font-weight: 500;
      }

      .contact-info {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 16px;
        font-size: 13px;
        color: #555;
      }

      .contact-item a {
        color: ${primaryColor};
        text-decoration: none;
      }

      .resume-section {
        margin-bottom: 24px;
      }

      .section-title {
        font-size: 18px;
        font-weight: 700;
        color: ${primaryColor};
        padding-bottom: 8px;
        border-bottom: 2px solid ${primaryColor};
        margin-bottom: 16px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .summary-text {
        font-size: 14px;
        color: #555;
        line-height: 1.8;
      }

      .experience-item, .education-item, .project-item {
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid #eee;
      }

      .experience-item:last-child, .education-item:last-child, .project-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }

      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
      }

      .item-left {
        flex: 1;
      }

      .item-right {
        text-align: right;
        white-space: nowrap;
        margin-left: 16px;
      }

      .item-title {
        font-size: 16px;
        font-weight: 600;
        color: #222;
      }

      .item-company, .item-degree, .item-role {
        font-size: 14px;
        color: ${secondaryColor};
        display: block;
        margin-top: 2px;
      }

      .item-location, .item-gpa {
        font-size: 13px;
        color: #888;
        display: inline-block;
        margin-right: 8px;
      }

      .item-link {
        font-size: 13px;
        color: ${primaryColor};
        text-decoration: none;
      }

      .item-date {
        font-size: 13px;
        color: #888;
        font-weight: 500;
      }

      .item-description {
        font-size: 14px;
        color: #555;
        margin-bottom: 8px;
      }

      .item-highlights {
        list-style: none;
        padding: 0;
      }

      .item-highlights li {
        font-size: 13px;
        color: #555;
        padding-left: 16px;
        position: relative;
        margin-bottom: 4px;
      }

      .item-highlights li::before {
        content: "▸";
        position: absolute;
        left: 0;
        color: ${primaryColor};
        font-weight: bold;
      }

      .skills-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .skill-tag {
        display: inline-block;
        padding: 4px 12px;
        background: ${primaryColor}15;
        color: ${primaryColor};
        border-radius: 4px;
        font-size: 13px;
        font-weight: 500;
        border: 1px solid ${primaryColor}30;
      }

      .item-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 8px;
      }

      .tag {
        display: inline-block;
        padding: 2px 8px;
        background: #f0f0f0;
        color: #666;
        border-radius: 3px;
        font-size: 12px;
      }

      .cert-list {
        list-style: disc;
        padding-left: 20px;
      }

      .cert-list li {
        font-size: 14px;
        color: #555;
        margin-bottom: 4px;
      }

      @media print {
        .resume-container {
          padding: 20px;
          box-shadow: none;
        }
      }
    </style>
  `
}

export function renderResume(data: ResumeData, template: ResumeTemplate): string {
  const styles = generateStyles(template)
  const header = renderPersonalInfo(data)
  const summary = renderSummary(data)
  const experience = renderExperience(data)
  const education = renderEducation(data)
  const projects = renderProjects(data)
  const skills = renderSkills(data)
  const certifications = renderCertifications(data)
  const languages = renderLanguages(data)

  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${escapeHtml(data.personalInfo.name)} - 简历</title>
      ${styles}
    </head>
    <body>
      <div class="resume-container">
        ${header}
        ${summary}
        ${experience}
        ${education}
        ${projects}
        ${skills}
        ${certifications}
        ${languages}
      </div>
    </body>
    </html>
  `
}
