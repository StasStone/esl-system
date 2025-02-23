export type FilterParam = {
  value: string | number
  active: boolean
}

export type Filter<F extends {}> = { [key in keyof F]: FilterParam }
