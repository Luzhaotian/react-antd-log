import { Button, Card, Popconfirm, Space, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import DataTable from '@/components/DataTable'
import ImagePreview from '@/components/ImagePreview'
import type { QrCodeItem, QrCodeTableProps } from '@/types'

function QrCodeTable({ loading, dataSource, onEdit, onDelete }: QrCodeTableProps) {
  const columns: ColumnsType<QrCodeItem> = [
    {
      title: '二维码',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 110,
      render: (imageUrl: string, record) => (
        <ImagePreview src={imageUrl} alt={`二维码-${record.text}`} width={56} height={56} />
      ),
    },
    {
      title: '内容',
      dataIndex: 'text',
      key: 'text',
      ellipsis: true,
    },
    {
      title: '长度',
      key: 'length',
      width: 100,
      render: (_, record) => <Tag>{record.text.length} 字符</Tag>,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (value: number) => new Date(value).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除该二维码吗？"
            okText="删除"
            cancelText="取消"
            onConfirm={() => onDelete(record.id)}
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card size="small">
      <DataTable<QrCodeItem>
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: total => `共 ${total} 条`,
        }}
        emptyText="暂无二维码，请点击右上角新增"
      />
    </Card>
  )
}

export default QrCodeTable
