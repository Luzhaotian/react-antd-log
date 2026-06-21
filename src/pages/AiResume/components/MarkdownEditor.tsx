import { useState } from 'react'
import { Button, Space, Input } from 'antd'
import { FileTextOutlined, ReloadOutlined } from '@ant-design/icons'

const { TextArea } = Input

interface MarkdownEditorProps {
  initialContent: string
  onContentChange: (content: string) => void
  onRegenerate: () => void
  isProcessing: boolean
}

const SAMPLE_MARKDOWN = `# 张三

📧 zhangsan@email.com | 📱 138-0000-0000 | 📍 北京市朝阳区 | 💻 github.com/zhangsan

## 个人简介

拥有5年全栈开发经验的软件工程师，专注于 React、Node.js 和云原生技术。热衷于构建高性能、可扩展的 Web 应用程序，具有丰富的团队协作和项目管理经验。

## 工作经历

### 高级前端工程师 | 字节跳动
**2022年3月 - 至今** | 北京

- 负责抖音 Web 端核心功能开发，日活用户超过 1 亿
- 主导前端性能优化项目，页面加载速度提升 40%
- 设计并实现了组件库，被 20+ 内部项目采用
- 指导初级开发者，组织技术分享会

### 前端工程师 | 阿里巴巴
**2019年7月 - 2022年2月** | 杭州

- 参与淘宝商家后台系统开发，服务百万级商家
- 使用 React + TypeScript 构建复杂表单系统
- 优化打包流程，构建时间减少 60%
- 获得季度优秀员工奖

## 教育背景

### 北京大学 | 硕士 · 计算机科学与技术
**2017年9月 - 2019年6月**
GPA: 3.8/4.0

### 浙江大学 | 学士 · 软件工程
**2013年9月 - 2017年6月**
GPA: 3.6/4.0 | 优秀毕业生

## 项目经历

### 企业级组件库 Design Pro
**技术负责人** | 2023年1月 - 2023年12月

设计并开发了一套企业级 UI 组件库，包含 50+ 高质量组件

- 基于 React 18 + TypeScript 构建，支持 Tree Shaking
- 完善的文档站点和在线 Playground
- GitHub Star 2000+，被多家公司采用
- 技术栈：React, TypeScript, Rollup, Storybook

### 实时协作编辑器
**核心开发者** | 2021年6月 - 2022年1月

基于 CRDT 算法的实时文档协作系统

- 支持多人同时编辑，冲突自动解决
- WebSocket 实时同步，延迟 < 100ms
- 支持富文本、表格、代码块等多种内容类型
- 技术栈：Vue 3, Yjs, WebSocket, Redis

## 专业技能

- React / Vue / Angular
- TypeScript / JavaScript
- Node.js / Express / Koa
- Webpack / Vite / Rollup
- Docker / Kubernetes
- PostgreSQL / MongoDB / Redis
- Git / CI/CD / GitHub Actions
- RESTful API / GraphQL

## 语言能力

- 中文（母语）
- 英文（流利，CET-6 580分）
`

export default function MarkdownEditor({
  initialContent,
  onContentChange,
  onRegenerate,
  isProcessing,
}: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [showSample, setShowSample] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    onContentChange(newContent)
  }

  const handleLoadSample = () => {
    setContent(SAMPLE_MARKDOWN)
    onContentChange(SAMPLE_MARKDOWN)
    setShowSample(false)
  }

  return (
    <div className="ai-resume-markdown-editor">
      <div className="editor-header">
        <h3 className="component-title">✏️ Markdown 编辑器</h3>
        <Space>
          <Button icon={<FileTextOutlined />} onClick={() => setShowSample(!showSample)}>
            {showSample ? '隐藏' : '查看'}示例
          </Button>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={onRegenerate}
            disabled={isProcessing || !content.trim()}
          >
            {isProcessing ? '生成中...' : '重新生成'}
          </Button>
        </Space>
      </div>

      {showSample && (
        <div className="sample-panel">
          <div className="sample-header">
            <span>示例 Markdown 简历</span>
            <Button type="link" onClick={handleLoadSample}>
              📥 加载此示例
            </Button>
          </div>
          <pre className="sample-content">{SAMPLE_MARKDOWN}</pre>
        </div>
      )}

      <TextArea
        className="editor-textarea"
        value={content}
        onChange={handleChange}
        placeholder="在此输入或粘贴您的 Markdown 简历内容..."
        autoSize={{ minRows: 15, maxRows: 30 }}
        spellCheck={false}
      />

      <div className="editor-footer">
        <span className="char-count">
          字符数: {content.length} | 行数: {content.split('\n').length}
        </span>
      </div>
    </div>
  )
}
