import { useState } from 'react'
import './LabelFilter.scss'

function LabelFilter({ attributes = [] }: { attributes: string[] }) {
  const [query, setQuery] = useState('')
  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (!query) return
    setQuery('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="search__container"
        placeholder="Search label"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
    </form>
  )
}

export default LabelFilter
