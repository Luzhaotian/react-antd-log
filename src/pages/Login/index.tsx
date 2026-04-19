import { useMemo } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { Button, Card, Form, Input, Typography, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useAsyncFn } from 'react-use'
import { isLoggedIn, setAuthSession } from '@/utils'

/** 模拟接口耗时（毫秒） */
const MOCK_LOGIN_DELAY_MS = 450

interface LoginFormValues {
  username: string
  password: string
}

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [messageApi, contextHolder] = message.useMessage()
  const fromPath = useMemo(() => {
    const state = location.state as { from?: string } | null
    return state?.from || '/'
  }, [location.state])

  const [state, doLogin] = useAsyncFn(async (values: LoginFormValues) => {
    await new Promise<void>(resolve => setTimeout(resolve, MOCK_LOGIN_DELAY_MS))
    const username = values.username?.trim() || '用户'
    const token = `mock-${Date.now()}`
    setAuthSession(token, username)
    return fromPath
  })

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const path = await doLogin(values)
      messageApi.success('登录成功')
      navigate(path, { replace: true })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '登录失败，请稍后重试'
      messageApi.error(errorMessage)
    }
  }

  if (isLoggedIn()) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen flex-center bg-[#f5f6f8] px-4">
      {contextHolder}
      <Card className="w-full max-w-[420px] rounded-xl shadow-sm">
        <div className="mb-6 text-center">
          <Typography.Title level={3} className="!mb-1">
            欢迎登录
          </Typography.Title>
          <Typography.Text type="secondary">
            本地演示：任意账号密码均可登录（模拟接口延时）
          </Typography.Text>
        </div>
        <Form<LoginFormValues>
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ username: '', password: '' }}
          autoComplete="off"
        >
          <Form.Item label="账号" name="username">
            <Input prefix={<UserOutlined />} placeholder="可任意填写" allowClear />
          </Form.Item>
          <Form.Item label="密码" name="password">
            <Input.Password prefix={<LockOutlined />} placeholder="可任意填写" allowClear />
          </Form.Item>
          <Form.Item className="!mb-1">
            <Button type="primary" htmlType="submit" block size="large" loading={state.loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login
