import { useContext, useState } from 'react'
import AuthContext from '../pages/AuthProvider'
import { useNavigate } from 'react-router-dom'

export default function useLogin() {
  const [error, setError] = useState<string | null>(null)
  const { storeToken } = useContext(AuthContext)!

  const navigate = useNavigate()

  const login = async (email: string, password: string) => {
    try {
      const userAttempt = { email, password }
      const res = await fetch('http://localhost:7071/api/login', {
        method: 'POST',
        body: JSON.stringify(userAttempt)
      })

      if (!res.ok) {
        throw new Error('Error logging')
      }

      const { token } = await res.json()

      storeToken(token)
      navigate('/labels')
    } catch (error: any) {
      setError(error.message)
    }
  }

  return { error, login }
}
