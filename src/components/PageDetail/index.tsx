import { useNavigate } from 'react-router-dom'
import { Space, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import TextButton from '@/components/TextButton'
import type { PageDetailProps } from '@/types'

const { Title, Text } = Typography

function PageDetail({
  title,
  description,
  backTo,
  onBack,
  extra,
  children,
  contentClassName = '',
}: PageDetailProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (backTo) {
      navigate(backTo, { viewTransition: true })
    }
  }

  const showBack = Boolean(backTo ?? onBack)

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {showBack && (
            <div className="mb-1">
              <TextButton icon={<ArrowLeftOutlined />} onClick={handleBack} className="px-0">
                返回
              </TextButton>
            </div>
          )}
          <Title level={4} className="!mb-0">
            {title}
          </Title>
          {description != null && description !== '' && (
            <Text type="secondary" className="text-sm">
              {description}
            </Text>
          )}
        </div>
        {extra != null && extra !== '' && <Space className="shrink-0">{extra}</Space>}
      </div>
      <div className={contentClassName}>{children}</div>
    </div>
  )
}

export default PageDetail
