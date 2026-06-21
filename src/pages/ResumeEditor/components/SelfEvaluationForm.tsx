import { Form, Input, Typography } from 'antd'
import { useResumeEditorStore } from '../store'

const { TextArea } = Input
const { Title, Paragraph } = Typography

export default function SelfEvaluationForm() {
  const { currentResume, updateSelfEvaluationContent } = useResumeEditorStore()
  if (!currentResume) return null

  return (
    <div>
      <Title level={4} style={{ marginBottom: 8 }}>
        自我评价
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        简要描述您的职业特点、技术优势和职业目标
      </Paragraph>

      <Form layout="vertical" style={{ maxWidth: 600 }}>
        <Form.Item label="自我评价">
          <TextArea
            value={currentResume.selfEvaluationContent}
            onChange={e => updateSelfEvaluationContent(e.target.value)}
            placeholder="如：拥有5年全栈开发经验的软件工程师，专注于 React、Node.js 和云原生技术。具备良好的团队协作能力和问题解决能力..."
            rows={6}
          />
        </Form.Item>
      </Form>
    </div>
  )
}
