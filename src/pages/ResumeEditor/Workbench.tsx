import { useEffect, useCallback, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Input, Space, Menu, message, Dropdown, Typography } from 'antd'
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  EyeOutlined,
  MoreOutlined,
  UserOutlined,
  BookOutlined,
  RiseOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  CommentOutlined,
} from '@ant-design/icons'
import { useResumeEditorStore } from './store'
import { getResumeTemplateById } from './templates'
import { exportToJson, exportMarkdownFile } from './utils/export'
import BasicInfoForm from './components/BasicInfoForm'
import EducationForm from './components/EducationForm'
import ExperienceForm from './components/ExperienceForm'
import ProjectsForm from './components/ProjectsForm'
import SkillsForm from './components/SkillsForm'
import SelfEvaluationForm from './components/SelfEvaluationForm'
import PreviewModal from './components/PreviewModal'
import TemplateSelector from './components/TemplateSelector'

const { Text } = Typography

const SECTION_ICONS: Record<string, React.ReactNode> = {
  basic: <UserOutlined />,
  education: <BookOutlined />,
  experience: <RiseOutlined />,
  projects: <RocketOutlined />,
  skills: <ThunderboltOutlined />,
  selfEvaluation: <CommentOutlined />,
}

export default function Workbench() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentResume, setCurrentResume, clearCurrentResume, updateResume, setActiveSection } =
    useResumeEditorStore()

  const [previewOpen, setPreviewOpen] = useState(false)
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false)

  useEffect(() => {
    if (id) {
      setCurrentResume(id)
    }
    return () => {
      clearCurrentResume()
    }
  }, [id, setCurrentResume, clearCurrentResume])

  const handleTitleChange = useCallback(
    (title: string) => {
      if (id) {
        updateResume(id, { title })
      }
    },
    [id, updateResume]
  )

  const handleBack = useCallback(() => {
    navigate('/resume-editor/list')
  }, [navigate])

  const handleExportJson = useCallback(() => {
    if (currentResume) {
      exportToJson(currentResume)
      message.success('已导出 JSON')
    }
  }, [currentResume])

  const handleExportMd = useCallback(() => {
    if (currentResume) {
      exportMarkdownFile(currentResume)
      message.success('已导出 Markdown')
    }
  }, [currentResume])

  const handlePreview = useCallback(() => {
    setPreviewOpen(true)
  }, [])

  const handleChangeTemplate = useCallback(() => {
    setTemplateSelectorOpen(true)
  }, [])

  if (!currentResume) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <Text type="secondary">加载中...</Text>
      </div>
    )
  }

  const template = getResumeTemplateById(currentResume.templateId || 'classic')

  const menuItems = currentResume.menuSections
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order)
    .map(s => ({
      key: s.id,
      icon: SECTION_ICONS[s.id] || null,
      label: s.title,
    }))

  const moreMenuItems = [
    { key: 'export-json', label: '导出 JSON', icon: <DownloadOutlined /> },
    { key: 'export-md', label: '导出 Markdown', icon: <DownloadOutlined /> },
    { key: 'change-template', label: '更换模板', icon: <EyeOutlined /> },
  ]

  const handleMoreClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'export-json':
        handleExportJson()
        break
      case 'export-md':
        handleExportMd()
        break
      case 'change-template':
        handleChangeTemplate()
        break
    }
  }

  const renderSectionContent = () => {
    switch (currentResume.activeSection) {
      case 'basic':
        return <BasicInfoForm />
      case 'education':
        return <EducationForm />
      case 'experience':
        return <ExperienceForm />
      case 'projects':
        return <ProjectsForm />
      case 'skills':
        return <SkillsForm />
      case 'selfEvaluation':
        return <SelfEvaluationForm />
      default:
        return <BasicInfoForm />
    }
  }

  return (
    <div style={{ display: 'flex', gap: 0, minHeight: 'calc(100vh - 120px)' }}>
      {/* Left sidebar - section navigation */}
      <div
        style={{
          width: 200,
          background: '#fff',
          borderRadius: '8px 0 0 8px',
          boxShadow: '1px 0 2px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            style={{ marginBottom: 8, fontSize: 13 }}
          >
            返回列表
          </Button>
          <Input
            value={currentResume.title}
            onChange={e => handleTitleChange(e.target.value)}
            variant="borderless"
            style={{ fontSize: 16, fontWeight: 600, padding: '4px 0' }}
            maxLength={50}
          />
          <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>模板: {template.name}</div>
        </div>

        {/* Section menu */}
        <Menu
          mode="inline"
          selectedKeys={[currentResume.activeSection]}
          onClick={({ key }) => setActiveSection(key)}
          items={menuItems}
          style={{ flex: 1, border: 'none' }}
        />

        {/* Actions */}
        <div style={{ padding: 12, borderTop: '1px solid #f0f0f0' }}>
          <Space direction="vertical" style={{ width: '100%' }} size={8}>
            <Button type="primary" icon={<EyeOutlined />} block onClick={handlePreview}>
              预览简历
            </Button>
            <Dropdown menu={{ items: moreMenuItems, onClick: handleMoreClick }} trigger={['click']}>
              <Button block icon={<MoreOutlined />}>
                更多操作
              </Button>
            </Dropdown>
          </Space>
        </div>
      </div>

      {/* Main content - form editor */}
      <div
        style={{
          flex: 1,
          background: '#fff',
          borderRadius: '0 8px 8px 0',
          padding: 24,
          overflow: 'auto',
        }}
      >
        {renderSectionContent()}
      </div>

      {/* Preview modal */}
      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        resume={currentResume}
      />

      {/* Template selector modal */}
      <TemplateSelector
        open={templateSelectorOpen}
        onClose={() => setTemplateSelectorOpen(false)}
        currentTemplateId={currentResume.templateId || 'classic'}
        onSelect={templateId => {
          if (id) {
            updateResume(id, { templateId })
            message.success('已更换模板')
          }
          setTemplateSelectorOpen(false)
        }}
      />
    </div>
  )
}
