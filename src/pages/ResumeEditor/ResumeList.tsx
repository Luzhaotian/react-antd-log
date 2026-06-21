import { useCallback, useState } from 'react'
import { Button, Card, Tag, Space, message, Popconfirm, Empty, Typography, Modal } from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  DownloadOutlined,
  ImportOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useResumeEditorStore } from './store'
import { getResumeTemplateById } from './templates'
import { exportToJson, exportMarkdownFile } from './utils/export'
import FileUpload from './components/FileUpload'
import type { ResumeData } from './types'

const { Text } = Typography

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function ResumeList() {
  const navigate = useNavigate()
  const { resumes, addResume, deleteResume, setCurrentResume } = useResumeEditorStore()
  const [importModalOpen, setImportModalOpen] = useState(false)

  const handleCreate = useCallback(() => {
    const id = addResume({ title: '未命名简历' })
    navigate(`/resume-editor/workbench/${id}`)
  }, [addResume, navigate])

  const handleImport = useCallback(
    (data: Partial<ResumeData>) => {
      const id = addResume({
        title: data.basic?.name ? `${data.basic.name}的简历` : '导入的简历',
        ...data,
      })
      setImportModalOpen(false)
      message.success('简历导入成功')
      navigate(`/resume-editor/workbench/${id}`)
    },
    [addResume, navigate]
  )

  const handleEdit = useCallback(
    (resume: ResumeData) => {
      setCurrentResume(resume.id)
      navigate(`/resume-editor/workbench/${resume.id}`)
    },
    [setCurrentResume, navigate]
  )

  const handleDelete = useCallback(
    (id: string) => {
      deleteResume(id)
      message.success('已删除')
    },
    [deleteResume]
  )

  const handleExportJson = useCallback((resume: ResumeData) => {
    exportToJson(resume)
    message.success('已导出 JSON')
  }, [])

  const handleExportMd = useCallback((resume: ResumeData) => {
    exportMarkdownFile(resume)
    message.success('已导出 Markdown')
  }, [])

  return (
    <div style={{ padding: 0 }}>
      <div
        style={{
          background: '#fff',
          borderRadius: 8,
          padding: '16px 24px',
          marginBottom: 12,
          boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <span style={{ fontSize: 18, fontWeight: 600 }}>我的简历</span>
          <Tag color="blue" style={{ marginLeft: 8 }}>
            {resumes.length} 份
          </Tag>
        </div>
        <Space>
          <Button icon={<ImportOutlined />} onClick={() => setImportModalOpen(true)}>
            导入简历
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建简历
          </Button>
        </Space>
      </div>

      {resumes.length === 0 ? (
        <Card>
          <Empty description="还没有简历" style={{ padding: '40px 0' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              创建第一份简历
            </Button>
          </Empty>
        </Card>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 16,
          }}
        >
          {resumes.map(resume => {
            const template = getResumeTemplateById(resume.templateId || 'classic')
            return (
              <Card
                key={resume.id}
                hoverable
                style={{ borderRadius: 8 }}
                actions={[
                  <Button
                    key="edit"
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(resume)}
                  >
                    编辑
                  </Button>,
                  <Button
                    key="json"
                    type="link"
                    icon={<DownloadOutlined />}
                    onClick={() => handleExportJson(resume)}
                  >
                    JSON
                  </Button>,
                  <Button
                    key="md"
                    type="link"
                    icon={<FileTextOutlined />}
                    onClick={() => handleExportMd(resume)}
                  >
                    MD
                  </Button>,
                  <Popconfirm
                    key="delete"
                    title="确定删除?"
                    onConfirm={() => handleDelete(resume.id)}
                  >
                    <Button type="link" danger icon={<DeleteOutlined />}>
                      删除
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <Card.Meta
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: template.colorScheme.primary,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {resume.title}
                      </span>
                    </div>
                  }
                  description={
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        模板: {template.name}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        更新: {formatDate(resume.updatedAt)}
                      </Text>
                      <Space size={4} wrap style={{ marginTop: 4 }}>
                        {resume.basic.name && <Tag>{resume.basic.name}</Tag>}
                        {resume.basic.title && <Tag color="blue">{resume.basic.title}</Tag>}
                      </Space>
                    </div>
                  }
                />
              </Card>
            )
          })}
        </div>
      )}

      {/* Import Modal */}
      <Modal
        title="导入简历"
        open={importModalOpen}
        onCancel={() => setImportModalOpen(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        <FileUpload onImport={handleImport} />
      </Modal>
    </div>
  )
}
