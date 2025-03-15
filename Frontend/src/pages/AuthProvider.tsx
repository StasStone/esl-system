import { createContext, useState, useEffect, ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'
import useUser from '../hooks/useUser'
import { User } from '../models/user'

type AuthContextType = {
  userID: string | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  storeToken: (token: any) => void
  clearToken: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userID, setUserID] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { user, isLoading, getUser } = useUser()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      try {
        const decoded: any = jwtDecode(token)

        if (decoded.exp! * 1000 > Date.now()) {
          getUser(decoded.userId)
          setIsAuthenticated(true)
        } else {
          clearToken()
        }
      } catch (error) {
        clearToken()
      }
    }
  }, [])

  const storeToken = (token: any) => {
    localStorage.setItem('token', token)
    setUserID(jwtDecode(token))
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
