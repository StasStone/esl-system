import { FilterParam } from '../models/filter-param'

export default function useFilter(activeFilterParams: {
  [key: string]: FilterParam
}) {
  function isFilterParamEmpty(): boolean {
    return Object.values(activeFilterParams).some(
      (filter: FilterParam) => filter.active && !filter.value
    )
  }

  function isFilterEmpty(): boolean {
    return Object.values(activeFilterParams).every(
      (filter: FilterParam) => filter.active && !filter.value
    )
  }

  function isFilterActive(): boolean {
    const isActive = Object.values(activeFilterParams).some(
      filter => filter.active
    )
    return isActive
  }

  return { isFilterParamEmpty, isFilterActive, isFilterEmpty }
}
