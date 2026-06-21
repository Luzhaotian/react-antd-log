import type { ResumeData, ResumeTemplate } from '@/types'

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ==================== 公共片段 ====================

function contactHtml(p: ResumeData['personalInfo']): string {
  const items: string[] = []
  if (p.email) items.push(`📧 ${esc(p.email)}`)
  if (p.phone) items.push(`📱 ${esc(p.phone)}`)
  if (p.location) items.push(`📍 ${esc(p.location)}`)
  if (p.website) items.push(`🌐 <a href="${esc(p.website)}">${esc(p.website)}</a>`)
  if (p.github) items.push(`💻 <a href="${esc(p.github)}">GitHub</a>`)
  if (p.linkedin) items.push(`🔗 <a href="${esc(p.linkedin)}">LinkedIn</a>`)
  return items.join(' &nbsp;·&nbsp; ')
}

function skillsHtml(data: ResumeData, color: string): string {
  if (!data.skills?.length) return ''
  return `<div class="section"><h2>专业技能</h2><div class="tags">${data.skills.map(s => `<span class="tag" style="background:${color}15;color:${color};border:1px solid ${color}30">${esc(s)}</span>`).join('')}</div></div>`
}

function languagesHtml(data: ResumeData, color: string): string {
  if (!data.languages?.length) return ''
  return `<div class="section"><h2>语言能力</h2><div class="tags">${data.languages.map(l => `<span class="tag" style="background:${color}15;color:${color};border:1px solid ${color}30">${esc(l)}</span>`).join('')}</div></div>`
}

function certsHtml(data: ResumeData): string {
  if (!data.certifications?.length) return ''
  return `<div class="section"><h2>证书资质</h2><ul class="cert-list">${data.certifications.map(c => `<li>${esc(c)}</li>`).join('')}</ul></div>`
}

// ==================== 布局 1: 经典单栏 ====================

function renderClassic(data: ResumeData, t: ResumeTemplate): string {
  const { primaryColor: c1, secondaryColor: c2, fontFamily: ff } = t
  const p = data.personalInfo

  let html = `<header style="text-align:center;border-bottom:3px solid ${c1};padding-bottom:16px;margin-bottom:24px">
    <h1 style="font-size:32px;color:${c1};margin:0;letter-spacing:2px">${esc(p.name)}</h1>
    ${p.title ? `<p style="font-size:16px;color:${c2};margin:4px 0 12px">${esc(p.title)}</p>` : ''}
    <div style="font-size:13px;color:#555">${contactHtml(p)}</div>
  </header>`

  if (data.summary)
    html += `<div class="section"><h2>个人简介</h2><p style="color:#555;line-height:1.8">${esc(data.summary)}</p></div>`
  if (data.experience?.length) {
    html += `<div class="section"><h2>工作经历</h2>${data.experience
      .map(
        e => `
      <div class="item"><div class="item-head"><div><b>${esc(e.position)}</b> · ${esc(e.company)}${e.location ? ` <span style="color:#888">| ${esc(e.location)}</span>` : ''}</div><span class="date">${esc(e.startDate)} - ${esc(e.endDate)}</span></div>
      ${e.description ? `<p style="color:#555;margin:4px 0">${esc(e.description)}</p>` : ''}
      ${e.highlights?.length ? `<ul>${e.highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`
      )
      .join('')}</div>`
  }
  if (data.education?.length) {
    html += `<div class="section"><h2>教育背景</h2>${data.education
      .map(
        e => `
      <div class="item"><div class="item-head"><div><b>${esc(e.school)}</b> · ${esc(e.degree)} · ${esc(e.major)}${e.gpa ? ` <span style="color:#888">GPA: ${esc(e.gpa)}</span>` : ''}</div><span class="date">${esc(e.startDate)} - ${esc(e.endDate)}</span></div>
      ${e.highlights?.length ? `<ul>${e.highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`
      )
      .join('')}</div>`
  }
  if (data.projects?.length) {
    html += `<div class="section"><h2>项目经历</h2>${data.projects
      .map(
        pj => `
      <div class="item"><div class="item-head"><div><b>${esc(pj.name)}</b> · ${esc(pj.role)}${pj.link ? ` <a href="${esc(pj.link)}" style="color:${c1}">🔗</a>` : ''}</div><span class="date">${esc(pj.startDate)} - ${esc(pj.endDate)}</span></div>
      ${pj.description ? `<p style="color:#555;margin:4px 0">${esc(pj.description)}</p>` : ''}
      ${pj.technologies?.length ? `<div class="tags" style="margin-bottom:6px">${pj.technologies.map(t => `<span class="tag-sm">${esc(t)}</span>`).join('')}</div>` : ''}
      ${pj.highlights?.length ? `<ul>${pj.highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`
      )
      .join('')}</div>`
  }
  html += skillsHtml(data, c1)
  html += certsHtml(data)
  html += languagesHtml(data, c1)

  return wrapHtml(ff, c1, c2, html)
}

// ==================== 布局 2: 左侧栏 ====================

function renderSidebar(data: ResumeData, t: ResumeTemplate): string {
  const { primaryColor: c1, fontFamily: ff } = t
  const p = data.personalInfo

  const sidebar = `
    <div class="sidebar">
      <h1 style="font-size:24px;color:#fff;margin:0">${esc(p.name)}</h1>
      ${p.title ? `<p style="color:rgba(255,255,255,.8);margin:4px 0 16px">${esc(p.title)}</p>` : ''}
      <div class="sb-block"><h3>联系方式</h3>
        ${p.email ? `<p>📧 ${esc(p.email)}</p>` : ''}
        ${p.phone ? `<p>📱 ${esc(p.phone)}</p>` : ''}
        ${p.location ? `<p>📍 ${esc(p.location)}</p>` : ''}
        ${p.github ? `<p>💻 <a href="${esc(p.github)}" style="color:rgba(255,255,255,.9)">GitHub</a></p>` : ''}
      </div>
      ${data.skills?.length ? `<div class="sb-block"><h3>专业技能</h3><div class="sb-tags">${data.skills.map(s => `<span>${esc(s)}</span>`).join('')}</div></div>` : ''}
      ${data.education?.length ? `<div class="sb-block"><h3>教育背景</h3>${data.education.map(e => `<p><b>${esc(e.school)}</b><br/>${esc(e.degree)} · ${esc(e.major)}<br/><span style="opacity:.7">${esc(e.startDate)} - ${esc(e.endDate)}</span>${e.gpa ? `<br/>GPA: ${esc(e.gpa)}` : ''}</p>`).join('')}</div>` : ''}
      ${data.languages?.length ? `<div class="sb-block"><h3>语言</h3><p>${data.languages.map(l => esc(l)).join('、')}</p></div>` : ''}
    </div>`

  let main = ''
  if (data.summary)
    main += `<div class="section"><h2>个人简介</h2><p style="color:#555;line-height:1.8">${esc(data.summary)}</p></div>`
  if (data.experience?.length) {
    main += `<div class="section"><h2>工作经历</h2>${data.experience
      .map(
        e => `
      <div class="item"><div class="item-head"><div><b>${esc(e.position)}</b> · ${esc(e.company)}</div><span class="date">${esc(e.startDate)} - ${esc(e.endDate)}</span></div>
      ${e.highlights?.length ? `<ul>${e.highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`
      )
      .join('')}</div>`
  }
  if (data.projects?.length) {
    main += `<div class="section"><h2>项目经历</h2>${data.projects
      .map(
        pj => `
      <div class="item"><div class="item-head"><div><b>${esc(pj.name)}</b> · ${esc(pj.role)}</div><span class="date">${esc(pj.startDate)} - ${esc(pj.endDate)}</span></div>
      ${pj.description ? `<p style="color:#555;margin:4px 0">${esc(pj.description)}</p>` : ''}
      ${pj.technologies?.length ? `<div class="tags" style="margin-bottom:6px">${pj.technologies.map(t => `<span class="tag-sm">${esc(t)}</span>`).join('')}</div>` : ''}
      ${pj.highlights?.length ? `<ul>${pj.highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`
      )
      .join('')}</div>`
  }

  return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}body{font-family:${ff};color:#333;line-height:1.6}
    .layout{display:flex;min-height:100vh;max-width:900px;margin:0 auto}
    .sidebar{width:280px;background:${c1};color:#fff;padding:32px 24px;flex-shrink:0}
    .sidebar h3{font-size:13px;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid rgba(255,255,255,.3);padding-bottom:6px;margin-bottom:10px;color:rgba(255,255,255,.7)}
    .sidebar p{font-size:13px;margin-bottom:6px;line-height:1.5}
    .sidebar a{color:rgba(255,255,255,.9);text-decoration:none}
    .sb-block{margin-bottom:20px}
    .sb-tags{display:flex;flex-wrap:wrap;gap:6px}.sb-tags span{font-size:12px;background:rgba(255,255,255,.15);padding:2px 8px;border-radius:3px}
    .main{flex:1;padding:32px}
    .section{margin-bottom:20px;break-inside:avoid;page-break-inside:avoid}.section h2{font-size:16px;color:${c1};border-bottom:2px solid ${c1};padding-bottom:6px;margin-bottom:12px;text-transform:uppercase;letter-spacing:1px;break-after:avoid;page-break-after:avoid}
    .item{margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #eee;break-inside:avoid;page-break-inside:avoid}.item:last-child{border-bottom:none}
    .item-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px}
    .date{font-size:12px;color:#888;white-space:nowrap;margin-left:12px}
    ul{padding-left:18px;font-size:13px;color:#555}ul li{margin-bottom:3px}
    .tags{display:flex;flex-wrap:wrap;gap:6px}.tag-sm{font-size:12px;background:#f0f0f0;color:#666;padding:2px 8px;border-radius:3px}
  </style></head><body><div class="layout">${sidebar}<div class="main">${main}</div></div></body></html>`
}

// ==================== 布局 3: 现代横幅 ====================

function renderBanner(data: ResumeData, t: ResumeTemplate): string {
  const { primaryColor: c1, secondaryColor: c2, fontFamily: ff } = t
  const p = data.personalInfo

  const banner = `<header style="background:linear-gradient(135deg,${c1},${c2});color:#fff;padding:40px;text-align:center">
    <h1 style="font-size:36px;margin:0;letter-spacing:3px">${esc(p.name)}</h1>
    ${p.title ? `<p style="font-size:18px;opacity:.9;margin:8px 0 16px">${esc(p.title)}</p>` : ''}
    <div style="font-size:13px;opacity:.85">${contactHtml(p)}</div>
  </header>`

  let body = ''
  if (data.summary)
    body += `<div class="section"><h2>个人简介</h2><p style="color:#555;line-height:1.8">${esc(data.summary)}</p></div>`

  const twoCol = (left: string, right: string) =>
    `<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">${left}${right}</div>`

  let expHtml = ''
  if (data.experience?.length) {
    expHtml = `<div class="section"><h2>工作经历</h2>${data.experience
      .map(
        e => `
      <div class="item"><div class="item-head"><div><b>${esc(e.position)}</b> · ${esc(e.company)}${e.location ? ` <span style="color:#888">| ${esc(e.location)}</span>` : ''}</div><span class="date">${esc(e.startDate)} - ${esc(e.endDate)}</span></div>
      ${e.highlights?.length ? `<ul>${e.highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`
      )
      .join('')}</div>`
  }

  let eduHtml = ''
  if (data.education?.length) {
    eduHtml = `<div class="section"><h2>教育背景</h2>${data.education
      .map(
        e => `
      <div class="item"><div class="item-head"><div><b>${esc(e.school)}</b></div><span class="date">${esc(e.startDate)} - ${esc(e.endDate)}</span></div>
      <p style="color:#555">${esc(e.degree)} · ${esc(e.major)}${e.gpa ? ` · GPA: ${esc(e.gpa)}` : ''}</p></div>
    </div>`
      )
      .join('')}</div>`
  }

  body += twoCol(expHtml, eduHtml)

  if (data.projects?.length) {
    body += `<div class="section"><h2>项目经历</h2>${data.projects
      .map(
        pj => `
      <div class="item"><div class="item-head"><div><b>${esc(pj.name)}</b> · ${esc(pj.role)}</div><span class="date">${esc(pj.startDate)} - ${esc(pj.endDate)}</span></div>
      ${pj.description ? `<p style="color:#555;margin:4px 0">${esc(pj.description)}</p>` : ''}
      ${pj.technologies?.length ? `<div class="tags" style="margin-bottom:6px">${pj.technologies.map(t => `<span class="tag-sm">${esc(t)}</span>`).join('')}</div>` : ''}
      ${pj.highlights?.length ? `<ul>${pj.highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
    </div>`
      )
      .join('')}</div>`
  }
  body += skillsHtml(data, c1)
  body += languagesHtml(data, c1)

  return wrapHtml(ff, c1, c2, banner + `<div style="padding:0 40px 40px">${body}</div>`)
}

// ==================== 布局 4: 时间轴 ====================

function renderTimeline(data: ResumeData, t: ResumeTemplate): string {
  const { primaryColor: c1, secondaryColor: c2, fontFamily: ff } = t
  const p = data.personalInfo

  let html = `<header style="border-left:4px solid ${c1};padding-left:20px;margin-bottom:28px">
    <h1 style="font-size:30px;color:${c1};margin:0">${esc(p.name)}</h1>
    ${p.title ? `<p style="font-size:15px;color:${c2};margin:4px 0 10px">${esc(p.title)}</p>` : ''}
    <div style="font-size:13px;color:#666">${contactHtml(p)}</div>
  </header>`

  if (data.summary)
    html += `<div class="section"><h2>简介</h2><p style="color:#555;line-height:1.8">${esc(data.summary)}</p></div>`

  if (data.experience?.length) {
    html += `<div class="section"><h2>工作经历</h2><div class="timeline">${data.experience
      .map(
        e => `
      <div class="tl-item"><div class="tl-dot" style="background:${c1}"></div><div class="tl-content">
        <div class="tl-date">${esc(e.startDate)} - ${esc(e.endDate)}</div>
        <b>${esc(e.position)}</b> · ${esc(e.company)}${e.location ? ` · ${esc(e.location)}` : ''}
        ${e.highlights?.length ? `<ul>${e.highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul>` : ''}
      </div></div>
    `
      )
      .join('')}</div></div>`
  }

  if (data.education?.length) {
    html += `<div class="section"><h2>教育背景</h2><div class="timeline">${data.education
      .map(
        e => `
      <div class="tl-item"><div class="tl-dot" style="background:${c1}"></div><div class="tl-content">
        <div class="tl-date">${esc(e.startDate)} - ${esc(e.endDate)}</div>
        <b>${esc(e.school)}</b> · ${esc(e.degree)} · ${esc(e.major)}${e.gpa ? ` · GPA: ${esc(e.gpa)}` : ''}
      </div></div>
    `
      )
      .join('')}</div></div>`
  }

  if (data.projects?.length) {
    html += `<div class="section"><h2>项目经历</h2><div class="timeline">${data.projects
      .map(
        pj => `
      <div class="tl-item"><div class="tl-dot" style="background:${c1}"></div><div class="tl-content">
        <div class="tl-date">${esc(pj.startDate)} - ${esc(pj.endDate)}</div>
        <b>${esc(pj.name)}</b> · ${esc(pj.role)}
        ${pj.description ? `<p style="color:#555;margin:4px 0">${esc(pj.description)}</p>` : ''}
        ${pj.technologies?.length ? `<div class="tags">${pj.technologies.map(t => `<span class="tag-sm">${esc(t)}</span>`).join('')}</div>` : ''}
      </div></div>
    `
      )
      .join('')}</div></div>`
  }

  html += skillsHtml(data, c1)
  html += certsHtml(data)
  html += languagesHtml(data, c1)

  return wrapHtml(
    ff,
    c1,
    c2,
    html,
    `
    .timeline{position:relative;padding-left:24px;border-left:2px solid #e0e0e0}
    .tl-item{position:relative;margin-bottom:18px;break-inside:avoid;page-break-inside:avoid}
    .tl-dot{position:absolute;left:-29px;top:4px;width:12px;height:12px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 2px ${c1}}
    .tl-date{font-size:12px;color:#888;margin-bottom:4px}
    .tl-content{font-size:14px}
  `
  )
}

// ==================== 布局 5: 卡片式 ====================

function renderCards(data: ResumeData, t: ResumeTemplate): string {
  const { primaryColor: c1, secondaryColor: c2, fontFamily: ff } = t
  const p = data.personalInfo

  let html = `<header style="text-align:center;padding:32px 0;border-bottom:2px solid #eee;margin-bottom:24px">
    <div style="width:80px;height:80px;border-radius:50%;background:${c1};color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:32px;font-weight:700;margin-bottom:12px">${esc(p.name.charAt(0))}</div>
    <h1 style="font-size:28px;color:#222;margin:0">${esc(p.name)}</h1>
    ${p.title ? `<p style="font-size:15px;color:${c1};margin:4px 0 10px">${esc(p.title)}</p>` : ''}
    <div style="font-size:13px;color:#666">${contactHtml(p)}</div>
  </header>`

  const card = (title: string, content: string) =>
    content
      ? `<div class="card"><h2 style="font-size:15px;color:${c1};margin:0 0 12px;display:flex;align-items:center;gap:8px"><span style="display:inline-block;width:4px;height:16px;background:${c1};border-radius:2px"></span>${title}</h2>${content}</div>`
      : ''

  if (data.summary)
    html += card('个人简介', `<p style="color:#555;line-height:1.8">${esc(data.summary)}</p>`)

  const grid = (items: string[]) =>
    `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">${items.join('')}</div>`

  if (data.experience?.length) {
    html += card(
      '工作经历',
      data.experience
        .map(
          e => `
      <div style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #f0f0f0">
        <div style="display:flex;justify-content:space-between"><b>${esc(e.position)}</b><span style="font-size:12px;color:#888">${esc(e.startDate)} - ${esc(e.endDate)}</span></div>
        <div style="font-size:13px;color:${c2}">${esc(e.company)}${e.location ? ` · ${esc(e.location)}` : ''}</div>
        ${e.highlights?.length ? `<ul style="font-size:13px;color:#555;padding-left:16px;margin-top:6px">${e.highlights.map(h => `<li style="margin-bottom:2px">${esc(h)}</li>`).join('')}</ul>` : ''}
      </div>
    `
        )
        .join('')
    )
  }

  const eduAndProj: string[] = []
  if (data.education?.length) {
    eduAndProj.push(
      card(
        '教育背景',
        data.education
          .map(
            e => `
      <div style="margin-bottom:10px"><b>${esc(e.school)}</b><div style="font-size:13px;color:#555">${esc(e.degree)} · ${esc(e.major)}${e.gpa ? ` · GPA: ${esc(e.gpa)}` : ''}</div><div style="font-size:12px;color:#888">${esc(e.startDate)} - ${esc(e.endDate)}</div></div>
    `
          )
          .join('')
      )
    )
  }
  if (data.projects?.length) {
    eduAndProj.push(
      card(
        '项目经历',
        data.projects
          .map(
            pj => `
      <div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between"><b>${esc(pj.name)}</b><span style="font-size:12px;color:#888">${esc(pj.startDate)} - ${esc(pj.endDate)}</span></div>
      <div style="font-size:13px;color:${c2}">${esc(pj.role)}</div>
      ${pj.description ? `<p style="font-size:13px;color:#555;margin:4px 0">${esc(pj.description)}</p>` : ''}
      </div>
    `
          )
          .join('')
      )
    )
  }
  if (eduAndProj.length) html += grid(eduAndProj)

  html += skillsHtml(data, c1)
  html += languagesHtml(data, c1)

  return wrapHtml(
    ff,
    c1,
    c2,
    html,
    `
    .card{background:#fafafa;border-radius:8px;padding:20px;margin-bottom:16px;border:1px solid #f0f0f0;break-inside:avoid;page-break-inside:avoid}
  `
  )
}

// ==================== HTML 包装 ====================

function wrapHtml(ff: string, c1: string, _c2: string, body: string, extraCss = ''): string {
  return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}body{font-family:${ff};color:#333;line-height:1.6;max-width:860px;margin:0 auto;padding:40px;background:#fff;orphans:3;widows:3}
    .section{margin-bottom:20px;break-inside:avoid;page-break-inside:avoid}.section h2{font-size:16px;font-weight:700;color:${c1};text-transform:uppercase;letter-spacing:1px;padding-bottom:6px;border-bottom:2px solid ${c1};margin-bottom:12px;break-after:avoid;page-break-after:avoid}
    .item{margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #eee;break-inside:avoid;page-break-inside:avoid}.item:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}
    .item-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px}
    .date{font-size:12px;color:#888;white-space:nowrap;margin-left:12px}
    ul{padding-left:18px;font-size:13px;color:#555;break-inside:avoid;page-break-inside:avoid}ul li{margin-bottom:3px}ul li::before{content:"▸";color:${c1};font-weight:bold;margin-right:4px}
    .tags{display:flex;flex-wrap:wrap;gap:6px}.tag{display:inline-block;padding:4px 12px;border-radius:4px;font-size:13px;font-weight:500}.tag-sm{font-size:12px;background:#f0f0f0;color:#666;padding:2px 8px;border-radius:3px}
    .cert-list{list-style:disc;padding-left:20px}.cert-list li{font-size:14px;color:#555;margin-bottom:4px}.cert-list li::before{display:none}
    @media print{body{padding:20px}}
    ${extraCss}
  </style></head><body>${body}</body></html>`
}

// ==================== 导出 ====================

export function renderResume(data: ResumeData, template: ResumeTemplate): string {
  switch (template.style) {
    case 'sidebar':
      return renderSidebar(data, template)
    case 'modern':
      return renderBanner(data, template)
    case 'creative':
      return renderTimeline(data, template)
    case 'minimal':
      return renderCards(data, template)
    case 'classic':
    default:
      return renderClassic(data, template)
  }
}
