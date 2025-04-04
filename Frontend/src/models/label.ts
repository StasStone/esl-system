import { Filter } from './filter-param'

export type Label = {
  label_id: string
  product_id: string
  last_updated: string
}

export const labelAttributes: Array<keyof LabelFilterParams> = [
  'label_id',
  'product_id',
  'last_updated'
]

export type LabelFilterParams = Filter<Label>

export const defaultLabelFilterParams: LabelFilterParams = {
  label_id: { value: '', active: false },
  product_id: { value: '', active: false },
  last_updated: { value: '', active: false }
}
