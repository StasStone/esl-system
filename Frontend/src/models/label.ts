export type Label = {
  id: string
  name: string
  price: string
  discount?: string
  producer: string
}

export const LabelAttributes: Array<keyof FilterParams> = [
  'id',
  'name',
  'price',
  'discount',
  'producer'
]

export type FilterParams = {
  id: { value: string; active: boolean }
  discount: { value: string; active: boolean }
  name: { value: string; active: boolean }
  price: { value: string; active: boolean }
  producer: { value: string; active: boolean }
}

export const DefaultFilterParams: FilterParams = {
  id: { value: '', active: false },
  name: { value: '', active: false },
  discount: { value: '', active: false },
  price: { value: '', active: false },
  producer: { value: '', active: false }
}
