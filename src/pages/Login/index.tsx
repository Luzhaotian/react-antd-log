import { useMemo } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { Button, Card, Form, Input, Typography, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useAsyncFn } from 'react-use'
import { login } from '@/api/auth'
import { DEFAULT_ACCOUNT, DEFAULT_PASSWORD, isLoggedIn, setAuthSession } from '@/utils'

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
    const data = await login({
      username: values.username,
      password: values.password,
    })

    setAuthSession(data.token, data.username)
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
          <Typography.Text type="secondary">请输入账号和密码继续使用系统</Typography.Text>
        </div>
        <Form<LoginFormValues>
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            username: DEFAULT_ACCOUNT,
            password: DEFAULT_PASSWORD,
          }}
          autoComplete="off"
        >
          <Form.Item
            label="账号"
            name="username"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入账号" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
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
