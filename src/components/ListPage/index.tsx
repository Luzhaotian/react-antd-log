import { Typography } from 'antd'
import SearchBar from '@/components/SearchBar'
import type { ListPageProps } from '@/types'

const { Title, Text } = Typography

function ListPage({
  title,
  description,
  extra,
  searchBarProps,
  children,
  className = '',
  titleRight = null,
}: ListPageProps) {
  const hasSearchBar = searchBarProps != null

  return (
    <div className={`p-4 ${className}`.trim()}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Title level={4} className="!mb-1">
            {title}
          </Title>
          {description != null && description !== '' && <Text type="secondary">{description}</Text>}
        </div>
        <div className="text-right">
          {titleRight != null && <div className="mb-4">{titleRight}</div>}
        </div>
      </div>

      {hasSearchBar && <SearchBar {...searchBarProps} />}
      {extra != null && <div className="mb-4">{extra}</div>}

      {children}
    </div>
  )
}

export default ListPage
