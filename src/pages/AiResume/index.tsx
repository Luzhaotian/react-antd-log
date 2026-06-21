import { useState, useCallback, useEffect, useMemo } from 'react'
import { Button, Card, Tag, Space, message, Modal, Popconfirm } from 'antd'
import {
  PlusOutlined,
  RobotOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { ResumeItem, ResumeAIConfig } from '@/types'
import ListPage from '@/components/ListPage'
import DataTable from '@/components/DataTable'
import type { SearchBarProps } from '@/types/components/searchBar'
import { getResumeTemplateById } from './templates'
import AIConfigDrawer from './components/AIConfigDrawer'
import ResumeEditDrawer from './components/ResumeEditDrawer'
import ResumePreview from './components/ResumePreview'
import './index.css'

const STORAGE_KEY = 'ai-resume-list'

function loadResumes(): ResumeItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function saveResumes(resumes: ResumeItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes))
}

export default function MyResumes() {
  const [resumes, setResumes] = useState<ResumeItem[]>(loadResumes)
  const [aiConfig, setAiConfig] = useState<ResumeAIConfig | null>(() => {
    const saved = localStorage.getItem('ai-resume-config')
    return saved ? JSON.parse(saved) : null
  })
  const [keyword, setKeyword] = useState('')

  const [configDrawerOpen, setConfigDrawerOpen] = useState(false)
  const [editDrawerOpen, setEditDrawerOpen] = useState(false)
  const [editingResume, setEditingResume] = useState<ResumeItem | null>(null)

  const [previewResume, setPreviewResume] = useState<ResumeItem | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  useEffect(() => {
    saveResumes(resumes)
  }, [resumes])

  const filteredList = useMemo(() => {
    if (!keyword) return resumes
    const kw = keyword.toLowerCase()
    return resumes.filter(
      r =>
        r.name.toLowerCase().includes(kw) ||
        getResumeTemplateById(r.templateId).name.toLowerCase().includes(kw)
    )
  }, [resumes, keyword])

  const handleCreate = useCallback(() => {
    setEditingResume(null)
    setEditDrawerOpen(true)
    setConfigDrawerOpen(false)
  }, [])

  const handleEdit = useCallback((resume: ResumeItem) => {
    setEditingResume(resume)
    setEditDrawerOpen(true)
    setConfigDrawerOpen(false)
  }, [])

  const handleDelete = useCallback((id: string) => {
    setResumes(prev => prev.filter(r => r.id !== id))
    message.success('已删除')
  }, [])

  const handleSave = useCallback((resume: ResumeItem) => {
    setResumes(prev => {
      const idx = prev.findIndex(r => r.id === resume.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = resume
        return next
      }
      return [resume, ...prev]
    })
  }, [])

  const handlePreview = useCallback((resume: ResumeItem) => {
    setPreviewResume(resume)
    setPreviewOpen(true)
    setEditDrawerOpen(false)
  }, [])

  const handleAiConfigChange = useCallback((config: ResumeAIConfig) => {
    setAiConfig(config)
  }, [])

  const searchBarProps: SearchBarProps = useMemo(
    () => ({
      fields: [
        {
          name: 'keyword',
          label: '关键词',
          placeholder: '按简历名称或模板名称搜索',
        },
      ],
      onSearch: values => {
        setKeyword((values.keyword ?? '').trim())
      },
      onReset: () => {
        setKeyword('')
      },
    }),
    []
  )

  const columns: ColumnsType<ResumeItem> = [
    {
      title: '简历名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '使用模板',
      key: 'template',
      width: 140,
      render: (_, record) => {
        const template = getResumeTemplateById(record.templateId)
        return <Tag color="blue">{template.name}</Tag>
      },
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_, record) =>
        record.resumeData ? <Tag color="green">已生成</Tag> : <Tag>未生成</Tag>,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (value: number) => new Date(value).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
            disabled={!record.resumeData}
          >
            预览
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除该简历吗？"
            okText="删除"
            cancelText="取消"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <ListPage
      title="我的简历"
      description="管理已创建的简历，支持预览、编辑和删除"
      searchBarProps={searchBarProps}
      extra={
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建简历
          </Button>
          <Button
            icon={<RobotOutlined />}
            onClick={() => {
              setConfigDrawerOpen(true)
              setEditDrawerOpen(false)
            }}
          >
            AI 配置
            {aiConfig && (
              <Tag color="green" style={{ marginLeft: 4 }}>
                已配置
              </Tag>
            )}
          </Button>
        </Space>
      }
    >
      <Card size="small">
        <DataTable<ResumeItem>
          columns={columns}
          dataSource={filteredList}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: total => `共 ${total} 条`,
          }}
          emptyText='还没有简历，点击右上角"新建简历"开始创建'
        />
      </Card>

      {/* AI 配置抽屉 */}
      <AIConfigDrawer
        open={configDrawerOpen}
        onClose={() => setConfigDrawerOpen(false)}
        config={aiConfig}
        onConfigChange={handleAiConfigChange}
      />

      {/* 简历编辑抽屉 */}
      <ResumeEditDrawer
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        resume={editingResume}
        aiConfig={aiConfig}
        onSave={handleSave}
        onPreview={handlePreview}
      />

      {/* 简历预览弹窗 */}
      <Modal
        title="📄 简历预览"
        open={previewOpen}
        onCancel={() => setPreviewOpen(false)}
        width={900}
        footer={null}
        destroyOnClose
      >
        {previewResume && (
          <ResumePreview
            resumeData={previewResume.resumeData}
            template={getResumeTemplateById(previewResume.templateId)}
            isLoading={false}
          />
        )}
      </Modal>
    </ListPage>
  )
}
