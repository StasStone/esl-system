import { useState } from 'react'

export default function useDeleteProduct() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const deleteProduct = async (productId: string, partitionKey: string) => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const res = await fetch(
        `http://localhost:7071/api/products/${productId}/${partitionKey}`,
        {
          method: 'DELETE'
        }
      )

      if (!res.ok) {
        throw new Error('Error deleting product')
      }

      const data = await res.json()
      setSuccessMessage(data.message)
    } catch (error) {
      setError('Failed to delete product. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    deleteProduct,
    isLoading,
    error,
    successMessage
  }
}
