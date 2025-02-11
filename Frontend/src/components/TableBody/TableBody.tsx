import { ReactElement } from 'react'
import { Label } from '../../models/label'

type TableBodyProps = {
  data: Label[]
  render: (label: Label) => ReactElement
}

export default function TableBody({ data, render }: TableBodyProps) {
  if (!data.length) return <div>No data</div>
  return <div>{data.map(render)}</div>
}
