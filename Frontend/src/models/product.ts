export type Product = {
  id: string
  name: string
  price: string
  discount?: string
  producer: string
  description?: string
  inventoryCount: number
  sku: string
  labels: string[]
}

export const productAttributes: Array<keyof ProductFilterParams> = [
  'id',
  'name',
  'price',
  'discount',
  'producer',
  'inventoryCount'
]

export type ProductFilterParams = {
  id: { value: string; active: boolean }
  inventoryCount: { value: number; active: boolean }
  discount: { value: string; active: boolean }
  name: { value: string; active: boolean }
  price: { value: string; active: boolean }
  producer: { value: string; active: boolean }
}

export const DefaultFilterParams: ProductFilterParams = {
  id: { value: '', active: false },
  name: { value: '', active: false },
  discount: { value: '', active: false },
  price: { value: '', active: false },
  producer: { value: '', active: false },
  inventoryCount: { value: 0, active: false }
}
