import { Card, Tag, Space, Button } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import ListPage from '@/components/ListPage'
import DataTable from '@/components/DataTable'

interface DataType {
  key: string
  id: number
  name: string
  email: string
  role: string
  status: string
}

function UserList() {
  const navigate = useNavigate()

  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === '活跃' ? 'green' : 'default'
        return <Tag color={color}>{status}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button
              type="link"
              onClick={() => navigate(`/user/detail/${record.id}`)}
            >
              查看详情
            </Button>
          </Space>
        )
      },
    },
  ]

  const data: DataType[] = [
    {
      key: '1',
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com',
      role: '管理员',
      status: '活跃',
    },
    {
      key: '2',
      id: 2,
      name: '李四',
      email: 'lisi@example.com',
      role: '用户',
      status: '活跃',
    },
    {
      key: '3',
      id: 3,
      name: '王五',
      email: 'wangwu@example.com',
      role: '用户',
      status: '禁用',
    },
  ]

  return (
    <ListPage
      title="用户列表"
      description="查看用户列表，点击「查看详情」进入用户详情页"
    >
      <Card size="small">
        <DataTable<DataType>
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: t => `共 ${t} 条` }}
          emptyText="暂无用户"
        />
      </Card>
    </ListPage>
  )
}

export default UserList
