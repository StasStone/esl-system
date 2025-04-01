import { Filter } from './filter-param'

export type Product = {
  id: string
  name: string
  price: string
  discount?: string
  producer: string
  labels: string[]
  updating: boolean
}

export const productAttributes: Array<keyof ProductFilterParams> = [
  'id',
  'name',
  'price',
  'discount',
  'producer'
]

export type ProductFilterParams = Filter<
  Pick<Product, 'id' | 'name' | 'price' | 'discount' | 'producer'>
>

export const defaultProductFilterParams: ProductFilterParams = {
  id: { value: '', active: false },
  name: { value: '', active: false },
  discount: { value: '', active: false },
  price: { value: '', active: false },
  producer: { value: '', active: false }
}
