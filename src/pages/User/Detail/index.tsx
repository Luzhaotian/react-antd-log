import { useParams } from 'react-router-dom'
import { Card, Descriptions } from 'antd'
import PageDetail from '@/components/PageDetail'

function UserDetail() {
  const { id } = useParams<{ id: string }>()

  // 模拟用户数据
  const userData = {
    id: id || '1',
    name: '张三',
    email: 'zhangsan@example.com',
    role: '管理员',
    status: '活跃',
    createTime: '2024-01-01 10:00:00',
    lastLogin: '2024-01-20 15:30:00',
  }

  return (
    <PageDetail
      title={`用户详情 - ${userData.name}`}
      backTo="/user/list"
    >
      <Card>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{userData.id}</Descriptions.Item>
          <Descriptions.Item label="姓名">{userData.name}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{userData.email}</Descriptions.Item>
          <Descriptions.Item label="角色">{userData.role}</Descriptions.Item>
          <Descriptions.Item label="状态">{userData.status}</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {userData.createTime}
          </Descriptions.Item>
          <Descriptions.Item label="最后登录">
            {userData.lastLogin}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </PageDetail>
  )
}

export default UserDetail
