import type { ResumeTemplate } from '@/types'
import { resumeTemplates } from '../templates'

interface TemplateSelectorProps {
  selectedTemplate: ResumeTemplate
  onTemplateChange: (template: ResumeTemplate) => void
}

function TemplateThumbnail({ template }: { template: ResumeTemplate }) {
  const { primaryColor, secondaryColor, style } = template

  return (
    <div className="template-thumbnail" style={{ borderColor: primaryColor }}>
      <div className="thumb-header" style={{ background: primaryColor }}>
        <div className="thumb-name" />
        <div className="thumb-title" style={{ background: secondaryColor }} />
      </div>
      <div className="thumb-body">
        {style === 'classic' && (
          <>
            <div className="thumb-line long" />
            <div className="thumb-line medium" />
            <div className="thumb-line short" />
            <div className="thumb-divider" style={{ background: primaryColor }} />
            <div className="thumb-line medium" />
            <div className="thumb-line long" />
          </>
        )}
        {style === 'modern' && (
          <>
            <div className="thumb-modern-layout">
              <div className="thumb-sidebar" style={{ background: `${primaryColor}20` }}>
                <div className="thumb-line short" />
                <div className="thumb-line short" />
              </div>
              <div className="thumb-main">
                <div className="thumb-line long" />
                <div className="thumb-line medium" />
              </div>
            </div>
          </>
        )}
        {style === 'creative' && (
          <>
            <div className="thumb-creative-accent" style={{ background: primaryColor }} />
            <div className="thumb-line long" />
            <div className="thumb-line medium" />
            <div className="thumb-circle" style={{ borderColor: primaryColor }} />
          </>
        )}
        {style === 'minimal' && (
          <>
            <div className="thumb-line long" />
            <div className="thumb-spacer" />
            <div className="thumb-line medium" />
            <div className="thumb-line short" />
          </>
        )}
      </div>
    </div>
  )
}

export default function TemplateSelector({
  selectedTemplate,
  onTemplateChange,
}: TemplateSelectorProps) {
  return (
    <div className="ai-resume-template-selector">
      <h3 className="component-title">🎨 选择模板</h3>
      <p className="component-desc">选择一个适合您行业的简历模板</p>

      <div className="template-grid">
        {resumeTemplates.map(template => (
          <button
            key={template.id}
            className={`template-card ${selectedTemplate.id === template.id ? 'active' : ''}`}
            onClick={() => onTemplateChange(template)}
          >
            <TemplateThumbnail template={template} />
            <div className="template-info">
              <span className="template-name">{template.name}</span>
              <span className="template-desc">{template.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
