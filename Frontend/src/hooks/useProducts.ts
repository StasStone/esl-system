import { useQuery } from '@tanstack/react-query'
import {
  defaultProductFilterParams,
  Product,
  productAttributes,
  ProductFilterParams
} from '../models/product'
import { useSearchParams } from 'react-router-dom'
import { PAGE_SIZE } from '../utils/constants'

const getProducts = async function (
  filters: ProductFilterParams,
  token: string | null,
  limit: number
): Promise<Array<Product>> {
  console.log('Data refetched')
  const res = await fetch('http://localhost:7071/api/products', {
    method: 'POST',
    body: JSON.stringify({ filters, limit, continuationToken: token })
  })
  const { products } = await res.json()
  return products
}

export default function useProducts() {
  const [searchParams] = useSearchParams()

  const values = productAttributes.map(attribute => [
    attribute,
    searchParams.get(attribute)
      ? searchParams.get(attribute)
      : defaultProductFilterParams[attribute]?.value
  ])

  const filters = Object.fromEntries(values)
  const continuationToken = searchParams.get('page')

  const {
    isLoading,
    error,
    data: products
  } = useQuery({
    queryKey: ['products', filters, continuationToken],
    queryFn: () => getProducts(filters, continuationToken, PAGE_SIZE)
  })

  console.log('QUERY KEY:', ['products', filters, continuationToken])
  return { isLoading, error, products: products ? products : [] }
}
