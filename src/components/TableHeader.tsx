import './TableHeader.css'

type TableHeaderProps = {
  headers: string[]
}

export default function TableHeader({ headers }: TableHeaderProps) {
  return (
    <div className="header">
      {headers.map(header => (
        <div key={header}>{header}</div>
      ))}
    </div>
  )
}
