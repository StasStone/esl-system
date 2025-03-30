export type Update = {
  update_id: string
  product_id: string
  label_id: string
  name: string
  price: string
  discount?: string
  producer: string
  status: UpdateStatus
}

export enum UpdateStatus {
  Pending = 'Pending',
  Success = 'Success',
  Failed = 'Failed'
}
