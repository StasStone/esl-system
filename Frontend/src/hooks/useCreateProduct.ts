import { useState } from 'react'
import { Product } from '../models/product'

export default function useCreateProduct() {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const createProduct = async (newProduct: Product) => {
    setIsCreating(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const res = await fetch(`http://localhost:7071/api/products/new`, {
        method: 'POST',
        body: JSON.stringify(newProduct)
      })

      if (!res.ok) {
        throw new Error('Error creating product')
      }

      const data = await res.json()
      setSuccessMessage(data.message)
    } catch (error) {
      setError('Failed to create a product. Please try again later.')
    } finally {
      setIsCreating(false)
    }
  }

  return {
    createProduct,
    isCreating,
    error,
    successMessage
  }
}
