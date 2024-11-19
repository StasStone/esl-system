import { ReactElement } from 'react'
import { Product } from '../../models/product'

type TableBodyProps = {
  data: Product[]
  render: (product: Product) => ReactElement
}

export default function TableBody({ data, render }: TableBodyProps) {
  if (!data.length) return <div>No data</div>
  return <div>{data.map(render)}</div>
}
