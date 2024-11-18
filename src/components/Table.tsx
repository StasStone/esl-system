import { ReactNode } from 'react'
import './Table.css'
import TableBody from './TableBody'
import TableHeader from './TableHeader'
import TableRow from './TableRow'

type TableProps = {
  children: ReactNode
}

export default function Table({ children }: TableProps) {
  return <div className="table-container">{children}</div>
}

Table.Body = TableBody
Table.Header = TableHeader
Table.Row = TableRow
