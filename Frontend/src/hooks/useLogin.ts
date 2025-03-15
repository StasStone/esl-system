import { useContext, useState } from 'react'
import AuthContext from '../pages/AuthProvider'
import { User } from '../models/user'

export default function useLogin() {
  const [error, setError] = useState<string | null>(null)

  const { storeToken } = useContext(AuthContext)!

  const login = async (email: string, password: string) => {
    try {
      const userAttempt: User = { email, password }
      const res = await fetch('http://localhost:7071/api/login', {
        method: 'POST',
        body: JSON.stringify(userAttempt)
      })

      if (!res.ok) {
        throw new Error('Error logging')
      }

      const { token } = await res.json()

      storeToken(token)
    } catch (error: any) {
      setError(error.message)
    }
  }

  return { error, login }
}
