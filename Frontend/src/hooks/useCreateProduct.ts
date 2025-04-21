import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Product } from '../models/product'

const createEditProduct = async (newProduct: Product) => {
  try {
    const res = await fetch(`http://localhost:7071/api/products/new`, {
      method: 'POST',
      body: JSON.stringify(newProduct)
    })

    if (res.status !== 201) {
      throw new Error('Error creating product')
    }

    const { product } = await res.json()
    return product
  } catch (error) {
    throw new Error('Failed to create a product. Please try again later.')
  }
}

export default function useCreateProduct() {
  const queryClient = useQueryClient()
  const {
    error,
    isPending: isCreating,
    mutate: createProduct
  } = useMutation({
    mutationFn: createEditProduct,
    onSuccess: () =>
      queryClient.invalidateQueries({
        predicate: query =>
          Array.isArray(query.queryKey) && query.queryKey[0] === 'products'
      })
  })

  return {
    createProduct,
    isCreating,
    error
  }
}
