import { Form, Input, Modal } from 'antd'
import type { QrCodeModalProps } from '@/types'

function QrCodeModal({ open, saving, editingRecord, form, onCancel, onSubmit }: QrCodeModalProps) {
  return (
    <Modal
      title={editingRecord ? '编辑二维码' : '新增二维码'}
      open={open}
      onCancel={onCancel}
      onOk={onSubmit}
      okText={editingRecord ? '保存' : '创建'}
      cancelText="取消"
      confirmLoading={saving}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="二维码内容"
          name="text"
          rules={[
            { required: true, message: '请输入要转译的文字' },
            { max: 500, message: '最多输入 500 个字符' },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="请输入文本内容，例如链接、备注、订单号等"
            showCount
            maxLength={500}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default QrCodeModal
