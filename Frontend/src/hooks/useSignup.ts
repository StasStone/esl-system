import { useContext, useState } from 'react'
import { User } from '../models/user'
import AuthContext from '../pages/AuthProvider'

export default function useSignup() {
  const [error, setError] = useState<string | null>(null)
  const { storeToken } = useContext(AuthContext)!

  const signup = async (email: string, password: string) => {
    try {
      const userAttempt: User = { email, password }
      const res = await fetch('http://localhost:7071/api/signup', {
        method: 'POST',
        body: JSON.stringify(userAttempt)
      })

      if (!res.ok) {
        throw new Error('Error signing up')
      }

      const { token } = await res.json()

      storeToken(token)
    } catch (error: any) {
      setError(error.message)
    }
  }

  return { error, signup }
}
