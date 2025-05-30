import { ReactNode, useContext, useEffect } from 'react'
import AuthContext from '../AuthProvider'
import { useNavigate } from 'react-router-dom'
import Loader from '../../components/Loader/Loader'
import './ProtectedRoute.scss'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()

  const { isAuthenticated, isLoading } = useContext(AuthContext)!

  useEffect(
    function () {
      if (isAuthenticated === false && !isLoading) navigate('/login')
    },
    [isAuthenticated, isLoading, navigate]
  )

  if (isLoading) {
    return (
      <div className="centered__loader">
        <Loader width="2rem" height="2rem" />
      </div>
    )
  }

  return children
}

export default ProtectedRoute
