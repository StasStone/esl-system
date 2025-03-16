import { createContext, useState, useEffect, ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'
import useUser from '../hooks/useUser'
import { User } from '../models/user'

type AuthContextType = {
  userID: string | null
  user: User | null
  isAuthenticated: boolean | null
  isLoading: boolean
  storeToken: (token: any) => void
  clearToken: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userID, setUserID] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { user, getUser } = useUser()

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token')

      if (token) {
        setIsLoading(true)
        try {
          const decoded: any = jwtDecode(token)

          if (decoded.exp! * 1000 > Date.now()) {
            await getUser(decoded.userId)
            setIsAuthenticated(true)
          } else {
            clearToken()
          }
        } catch (error) {
          clearToken()
        } finally {
          setIsLoading(false)
        }
      }
    }
    validateToken()
  }, [userID])

  useEffect(() => {
    if (user) {
      console.log('User data fetched, setting isAuthenticated to true')
      setIsAuthenticated(true)
    } else if (user === null && !isLoading) {
      setIsAuthenticated(false)
    }
  }, [user, isLoading])

  const storeToken = (token: any) => {
    const decoded: any = jwtDecode(token)
    localStorage.setItem('token', token)
    setUserID(decoded.userId)
  }

  const clearToken = () => {
    localStorage.removeItem('token')
    setUserID(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        userID,
        user,
        storeToken,
        clearToken
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
