import './Pagination.scss'

type PaginationProps = {
  continuationToken: string | null
  previousTokens: string[]
  onPrev: () => void
  onNext: () => void
}

export default function Pagination({
  continuationToken,
  previousTokens = [],
  onPrev,
  onNext
}: PaginationProps) {
  return (
    <div className="pagination-controls">
      <button onClick={onPrev} disabled={previousTokens.length === 0}>
        Previous Page
      </button>

      <button onClick={onNext} disabled={!continuationToken}>
        Next Page
      </button>
    </div>
  )
}
