import { Filter } from './filter-param'

export type Label = {
  id: string
  product_id: string
  gateway_id: string
  last_updated: string
}

export const labelAttributes: Array<keyof LabelFilterParams> = [
  'id',
  'product_id',
  'gateway_id',
  'last_updated'
]

export type LabelFilterParams = Filter<Label>

export const defaultLabelFilterParams: LabelFilterParams = {
  id: { value: '', active: false },
  product_id: { value: '', active: false },
  gateway_id: { value: '', active: false },
  last_updated: { value: '', active: false }
}
