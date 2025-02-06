import { ChangeEventHandler } from 'react'
import './Search.scss'

function Search({
  value,
  onChange
}: {
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
}) {
  return (
    <form className="search__container">
      <input className="search__field" value={value} onChange={onChange} />
    </form>
  )
}

export default Search
