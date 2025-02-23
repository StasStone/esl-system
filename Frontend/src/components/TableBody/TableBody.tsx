import { ReactElement } from 'react'

type TableBodyProps<T> = {
  data: T[]
  render: (item: T) => ReactElement
}

export default function TableBody({ data, render }: TableBodyProps<any>) {
  if (!data.length) return <div>No data</div>
  return <div>{data.map(render)}</div>
}
