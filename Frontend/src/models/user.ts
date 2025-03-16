export type User = {
  email: string
  password: string
  store_id: string
}

export const userEmpty: User = { email: '', password: '', store_id: '' }
