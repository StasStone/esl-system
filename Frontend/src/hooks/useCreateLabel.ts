import { useState } from 'react'
import { Label } from '../models/label'

export function useCreateLabel() {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const createLabel = async (newLabel: Label) => {
    setIsCreating(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const res = await fetch(`http://localhost:7071/api/labels/new`, {
        method: 'POST',
        body: JSON.stringify(newLabel)
      })

      if (!res.ok) {
        throw new Error('Error creating label')
      }

      const data = await res.json()
      setSuccessMessage(data.message)
    } catch (error) {
      setError('Failed to create a label. Please try again later.')
    } finally {
      setIsCreating(false)
    }
  }

  return {
    createLabel,
    isCreating,
    error,
    successMessage
  }
}
