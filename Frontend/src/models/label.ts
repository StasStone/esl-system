export type Label = {
  id: number
  name: string
  price: string
  discount?: string
  producer: string
}

export const LabelAttributes: string[] = [
  'id',
  'name',
  'price',
  'discount',
  'producer'
]
