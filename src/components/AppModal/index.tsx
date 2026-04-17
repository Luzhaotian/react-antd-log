import { Modal } from 'antd'
import type { ModalProps } from 'antd'

/**
 * 基于 antd Modal 的二次封装，统一项目内弹窗用法。
 * 透传所有 ModalProps；静态方法（confirm、info、success 等）一并暴露，便于统一管理。
 */
function AppModal(props: ModalProps) {
  return <Modal {...props} />
}

AppModal.confirm = Modal.confirm
AppModal.info = Modal.info
AppModal.success = Modal.success
AppModal.warning = Modal.warning
AppModal.error = Modal.error

export default AppModal
