import './TableHeader.scss'

type TableHeaderProps = {
  headers: string[]
}

export default function TableHeader({ headers }: TableHeaderProps) {
  return (
    <div className="table__header">
      {headers.map(header => (
        <div key={header}>{header}</div>
      ))}
    </div>
  )
}
