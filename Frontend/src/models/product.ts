import { Filter } from './filter-param'

export type Product = {
  id: string
  name: string
  price: string
  discount?: string
  producer: string
  description?: string
  inventory_count: number
  sku: string
  labels: string[]
}

export const productAttributes: Array<keyof ProductFilterParams> = [
  'id',
  'name',
  'price',
  'discount',
  'producer',
  'inventory_count'
]

export type ProductFilterParams = Filter<
  Pick<
    Product,
    'id' | 'name' | 'price' | 'discount' | 'producer' | 'inventory_count'
  >
>

export const defaultProductFilterParams: ProductFilterParams = {
  id: { value: '', active: false },
  name: { value: '', active: false },
  discount: { value: '', active: false },
  price: { value: '', active: false },
  producer: { value: '', active: false },
  inventory_count: { value: 0, active: false }
}
