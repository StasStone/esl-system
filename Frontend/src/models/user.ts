export type User = {
  id: string
  email: string
  password: string
  store_id: string
}

export type UserInfo = User & Interval

type Interval = {
  interval: number
}

export const userEmpty: User = {
  email: '',
  password: '',
  store_id: '',
  id: ''
}
