import { ReactNode, useContext } from 'react'
import AuthContext from './AuthProvider'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext)!

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" />
  }

  if (isLoading) {
    return <div>Content is loading</div>
  }

  if (isAuthenticated) return children
}

export default ProtectedRoute
