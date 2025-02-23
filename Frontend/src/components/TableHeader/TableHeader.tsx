import { headerClasses } from '../../models/columns'
import './TableHeader.scss'

type TableHeaderProps = {
  headers: string[]
}

export default function TableHeader({ headers }: TableHeaderProps) {
  const headerClass = headerClasses[headers.length - 1]
  return (
    <div className={headerClass}>
      {headers.map(header => (
        <div key={header}>{header}</div>
      ))}
    </div>
  )
}
