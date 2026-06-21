import { Form, Input, Typography } from 'antd'
import { useResumeEditorStore } from '../store'

const { TextArea } = Input
const { Title, Paragraph } = Typography

export default function SkillsForm() {
  const { currentResume, updateSkillContent } = useResumeEditorStore()
  if (!currentResume) return null

  return (
    <div>
      <Title level={4} style={{ marginBottom: 8 }}>
        专业技能
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        请列出您的专业技能，建议每行一个技能或使用逗号分隔
      </Paragraph>

      <Form layout="vertical" style={{ maxWidth: 600 }}>
        <Form.Item label="技能列表">
          <TextArea
            value={currentResume.skillContent}
            onChange={e => updateSkillContent(e.target.value)}
            placeholder={`React / Vue / TypeScript\nNode.js / Express\nDocker / Kubernetes\nGit / CI/CD`}
            rows={8}
            style={{ fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace" }}
          />
        </Form.Item>
      </Form>
    </div>
  )
}
