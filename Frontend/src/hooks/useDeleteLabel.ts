import { useState } from 'react'

export default function useDeleteLabel() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const deleteLabel = async (labelId: string, partitionKey: string) => {
    console.log(labelId, partitionKey)
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const res = await fetch(
        `http://localhost:7071/api/labels/${labelId}/${partitionKey}`,
        {
          method: 'DELETE'
        }
      )
      console.log(res)
      if (!res.ok) {
        throw new Error('Error deleting label')
      }

      const data = await res.json()
      setSuccessMessage(data.message)
    } catch (error) {
      setError('Failed to delete label. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    deleteLabel,
    isLoading,
    error,
    successMessage
  }
}
