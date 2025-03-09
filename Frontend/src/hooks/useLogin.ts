import { useState } from 'react'
import { User } from '../models/user'

export default function useLogin() {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

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

      const { user } = await res.json()

      setUser(user)
    } catch (error: any) {
      setError(error.message)
    }
  }

  return { user, error, login }
}
