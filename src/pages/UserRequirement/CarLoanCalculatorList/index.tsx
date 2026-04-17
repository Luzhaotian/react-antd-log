import { Card, Empty } from 'antd'
import ListPage from '@/components/ListPage'

export default function CarLoanCalculatorList() {
  return (
    <ListPage
      title="车贷计算器列表"
      description="用于管理车贷计算方案。当前页面已创建，后续可继续补充新增、编辑与导出能力"
    >
      <Card>
        <Empty description="车贷计算器功能建设中" />
      </Card>
    </ListPage>
  )
}
