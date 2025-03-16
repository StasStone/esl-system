import { ReactNode, useContext, useEffect } from 'react'
import AuthContext from './AuthProvider'
import { useNavigate } from 'react-router-dom'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()

  const { isAuthenticated, isLoading } = useContext(AuthContext)!
  console.log(isAuthenticated, isLoading)

  useEffect(
    function () {
      if (isAuthenticated === false && !isLoading) navigate('/login')
    },
    [isAuthenticated, isLoading, navigate]
  )

  if (isLoading) {
    return <div>Content is loading</div>
  }

  return children
}

export default ProtectedRoute
