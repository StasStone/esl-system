import { useContext, useState } from 'react'
import AuthContext from '../pages/AuthProvider'
import { useNavigate } from 'react-router-dom'

export default function useSignup() {
  const [error, setError] = useState<string | null>(null)
  const { storeToken } = useContext(AuthContext)!
  const navigate = useNavigate()

  const signup = async (email: string, password: string, store_id: string) => {
    try {
      const userAttempt = { email, password, store_id }
      const res = await fetch('http://localhost:7071/api/signup', {
        method: 'POST',
        body: JSON.stringify(userAttempt)
      })

      if (!res.ok) {
        const { message } = await res.json()
        console.log(message)
        throw new Error(message)
      }

      const { token } = await res.json()
      console.log(token)

      storeToken(token)
      navigate('/labels')
    } catch (error: any) {
      setError(error.message)
    }
  }

  return { error, signup }
}
