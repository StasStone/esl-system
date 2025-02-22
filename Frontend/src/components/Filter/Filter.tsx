import Search from '../Search/Search'
import './Filter.scss'
import { FilterParam } from '../../models/filter-param'

type FilterProps<T extends { [key: string]: FilterParam }> = {
  attributes: Array<keyof T>
  defaultFilterParams: T
  activeFilterParams: T
  setActiveFilterParams: React.Dispatch<React.SetStateAction<T>>
  handleApplyFilters: (filters: T) => void
}

function Filter<T extends { [key: string]: FilterParam }>({
  attributes,
  defaultFilterParams,
  activeFilterParams,
  setActiveFilterParams,
  handleApplyFilters
}: FilterProps<T>) {
  function isFilterEmpty(): boolean {
    return Object.values(activeFilterParams).some(
      (filter: FilterParam) => filter.active && !filter.value
    )
  }

  function isFilterActive(): boolean {
    const isActive = Object.values(activeFilterParams).some(
      filter => filter.active
    )
    return isActive
  }

  function isFilterParamActive(
    filterParam: keyof typeof defaultFilterParams
  ): boolean {
    return activeFilterParams[filterParam].active
  }

  function handleApplyFilterParam(
    filterParam: keyof typeof defaultFilterParams
  ) {
    setActiveFilterParams(prev => ({
      ...prev,
      [filterParam]: {
        ...prev[filterParam],
        active: !prev[filterParam].active,
        value: ''
      }
    }))
  }

  function handleFilterValueChange<K extends keyof typeof defaultFilterParams>(
    filterParam: K,
    value: string | number
  ) {
    setActiveFilterParams(prev => ({
      ...prev,
      [filterParam]: {
        ...prev[filterParam],
        value
      }
    }))
  }

  return (
    <div className="filters">
      <div className="filters__container">
        Filter by
        {attributes.map(attribute => (
          <div key={String(attribute)} className="filter-row">
            <label className="filter__param">
              <input
                onChange={() => handleApplyFilterParam(attribute)}
                type="checkbox"
              />
              <span className="filter__param-checkmark"></span>
              {String(attribute)}
            </label>
            {isFilterParamActive(attribute) && (
              <Search
                value={activeFilterParams[attribute].value.toString()}
                onChange={(e: any) =>
                  handleFilterValueChange(attribute, e.target.value)
                }
              />
            )}
          </div>
        ))}
        {isFilterActive() && (
          <button
            className="standard-btn"
            disabled={isFilterEmpty()}
            onClick={() => handleApplyFilters(activeFilterParams)}
          >
            Apply Filters
          </button>
        )}
      </div>
    </div>
  )
}

export default Filter
