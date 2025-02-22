export type FilterParam = {
  value: string | number
  active: boolean
}

export type Filter<F extends {}> = { [key in keyof F]: FilterParam }

export function applyFilters<T>(
  data: T[],
  filters: { [key in keyof T]: FilterParam }
): T[] {
  const newFilteredData = data.filter(data =>
    (Object.entries(filters) as [keyof T, FilterParam][]).every(
      ([key, filter]) => {
        if (!filter.active || !filter.value) return true
        const dataValue = data[key as keyof T]
        return dataValue?.toString().toLowerCase() === filter.value
      }
    )
  )
  return newFilteredData
}
