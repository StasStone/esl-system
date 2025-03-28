export type User = {
  user_id: string
  email: string
  password: string
  store_id: string
}

export const userEmpty: User = {
  email: '',
  password: '',
  store_id: '',
  user_id: ''
}
