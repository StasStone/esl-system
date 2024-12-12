import { ReactNode } from 'react'
import './Table.css'
import TableBody from '../TableBody/TableBody'
import TableHeader from '../TableHeader/TableHeader'
import TableRow from '../TableRow/TableRow'

type TableProps = {
  children: ReactNode
}

export default function Table({ children }: TableProps) {
  return <div className="table-container">{children}</div>
}

Table.Body = TableBody
Table.Header = TableHeader
Table.Row = TableRow
