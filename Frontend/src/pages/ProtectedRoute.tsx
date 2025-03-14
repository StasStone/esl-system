import { useNavigate } from 'react-router-dom'
import { ReactNode, useEffect } from 'react'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()
  const { isLoading, isAuthenticated } = useUser()

  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) navigate('/login')
    },
    [isAuthenticated, isLoading, navigate]
  )

  if (isLoading) {
    return <div>Content is loading</div>
  }

  if (isAuthenticated) return children
}

export default ProtectedRoute
