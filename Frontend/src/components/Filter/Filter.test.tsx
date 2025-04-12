import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Filter from './Filter'

jest.mock('../../hooks/useFilter', () => {
  return () => ({
    isFilterActive: () => true,
    isFilterParamEmpty: () => false
  })
})

const defaultFilters = {
  name: { value: '', active: false },
  category: { value: '', active: false }
}

describe('Filter component', () => {
  let activeFilters = JSON.parse(JSON.stringify(defaultFilters))
  const setActiveFilterParams = jest.fn(update => {
    if (typeof update === 'function') {
      activeFilters = update(activeFilters)
    } else {
      activeFilters = update
    }
  })
  const handleApplyFilters = jest.fn()

  beforeEach(() => {
    activeFilters = JSON.parse(JSON.stringify(defaultFilters))
    jest.clearAllMocks()
  })

  it('renders checkboxes for attributes', () => {
    render(
      <Filter
        attributes={['name', 'category']}
        defaultFilterParams={defaultFilters}
        activeFilterParams={activeFilters}
        setActiveFilterParams={setActiveFilterParams}
        handleApplyFilters={handleApplyFilters}
      />
    )

    expect(screen.getByText('Filter by')).toBeInTheDocument()
    expect(screen.getByLabelText('name')).toBeInTheDocument()
    expect(screen.getByLabelText('category')).toBeInTheDocument()
  })

  it('toggles filter active state and shows search input', () => {
    render(
      <Filter
        attributes={['name']}
        defaultFilterParams={defaultFilters}
        activeFilterParams={activeFilters}
        setActiveFilterParams={setActiveFilterParams}
        handleApplyFilters={handleApplyFilters}
      />
    )

    const checkbox = screen.getByLabelText('name')
    fireEvent.click(checkbox)

    expect(setActiveFilterParams).toHaveBeenCalled()
  })

  it('calls handleApplyFilters when Apply Filters is clicked', () => {
    const activeFiltersWithState = {
      name: { value: 'abc', active: true },
      category: { value: '', active: false }
    }

    render(
      <Filter
        attributes={['name', 'category']}
        defaultFilterParams={defaultFilters}
        activeFilterParams={activeFiltersWithState}
        setActiveFilterParams={setActiveFilterParams}
        handleApplyFilters={handleApplyFilters}
      />
    )

    const applyBtn = screen.getByText('Apply Filters')
    fireEvent.click(applyBtn)

    expect(handleApplyFilters).toHaveBeenCalledWith(activeFiltersWithState)
  })
})
