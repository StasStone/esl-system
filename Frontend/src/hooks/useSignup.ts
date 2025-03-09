import { useState } from 'react'
import { User } from '../models/user'

export default function useSignup() {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

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

      const { user } = await res.json()

      setUser(user)
    } catch (error: any) {
      setError(error.message)
    }
  }

  return { user, error, signup }
}
