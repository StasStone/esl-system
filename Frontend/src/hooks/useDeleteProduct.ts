import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DatabaseId } from '../models/database-id'

const deleteProductApi = async ({ id, partition }: DatabaseId) => {
  console.log(id, partition)
  try {
    const res = await fetch(
      `http://localhost:7071/api/products/${id}/${partition}`,
      {
        method: 'DELETE'
      }
    )

    if (!res.ok) {
      throw new Error('Error deleting product')
    }

    const data = await res.json()

    return data
  } catch (error) {
    throw new Error('Failed to delete product. Please try again later.')
  }
}

export default function useDeleteProduct() {
  const queryClient = useQueryClient()
  const {
    isPending: isDeleting,
    mutate: deleteProduct,
    error
  } = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: () =>
      queryClient.invalidateQueries({
        predicate: query =>
          Array.isArray(query.queryKey) && query.queryKey[0] === 'products'
      })
  })

  return {
    deleteProduct,
    isDeleting,
    error
  }
}
