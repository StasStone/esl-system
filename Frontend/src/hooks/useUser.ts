import { useState } from 'react'
import { User } from '../models/user'

export default function useUser() {
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const getUser = async (user_id: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`http://localhost:7071/api/users/${user_id}`, {
        method: 'GET'
      })

      if (!res.ok) {
        throw new Error('Error fetching the user')
      }
      const data = await res.json()

      setUser(data)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = async (newUser: User) => {
    setIsLoading(true)
    try {
      const res = await fetch('http://localhost:7071/api/users', {
        method: 'PUT',
        body: JSON.stringify({ user: newUser })
      })

      if (!res.ok) {
        throw new Error('Error updating the user')
      }
      const data = await res.json()
      const { user } = data
      setUser(user)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return { error, isLoading, user, getUser, updateUser }
}
