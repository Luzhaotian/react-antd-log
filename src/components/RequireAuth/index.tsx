import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { isLoggedIn } from '@/utils'

interface RequireAuthProps {
  children: ReactNode
}

function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation()

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}

export default RequireAuth
