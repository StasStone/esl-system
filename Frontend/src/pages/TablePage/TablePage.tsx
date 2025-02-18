import { useEffect, useState } from 'react'
import Table from '../../components/Table/Table'
import Search from '../../components/Search/Search'
import { mockedData } from '../../mocks/mock-data'
import { mockedHeaders } from '../../mocks/mock-headers'
import {
  DefaultFilterParams,
  FilterParams,
  Label,
  LabelAttributes
} from '../../models/label'

import './TablePage.scss'

function TablePage() {
  const [activeFilterParams, setActiveFilterParams] =
    useState<FilterParams>(DefaultFilterParams)

  const [filteredData, setFilteredData] = useState<Label[]>([])

  function handleApplyFilters(): void {
    const newFilteredData = mockedData.filter(data =>
      Object.entries(activeFilterParams).every(([key, filter]) => {
        if (!filter.active || !filter.value) return true

        const dataValue = data[key as keyof Label]
        return (
          dataValue?.toString().toLowerCase() === filter.value.toLowerCase()
        )
      })
    )
    setFilteredData(newFilteredData)
  }

  function isFilterEmpty(): boolean {
    return Object.values(activeFilterParams).some(
      filter => filter.active && !filter.value
    )
  }

  function isFilterActive(): boolean {
    return Object.values(activeFilterParams).some(filter => filter.active)
  }

  function isFilterParamActive(filterParam: keyof FilterParams): boolean {
    return activeFilterParams[filterParam].active
  }

  function handleApplyFilterParam(filterParam: keyof FilterParams) {
    setActiveFilterParams(prev => ({
      ...prev,
      [filterParam]: {
        ...prev[filterParam],
        active: !prev[filterParam].active,
        value: ''
      }
    }))
  }

  function handleFilterValueChange(filterParam: string, value: string) {
    setActiveFilterParams(prev => ({
      ...prev,
      [filterParam]: {
        ...prev[filterParam as keyof FilterParams],
        value
      }
    }))
  }

  useEffect(() => {
    const getData = async function () {
      const res = await fetch('http://localhost:7071/api/labels')
      const data = await res.json()
      console.log(data)
      // if (!isFilterActive() && results > 0) {
      //   setFilteredData(data.labels)
      // }
    }

    getData()
  }, [activeFilterParams])

  return (
    <>
      <div className="filters">
        <div className="filters__container">
          Filter by
          {LabelAttributes.map(labelAttribute => (
            <div key={labelAttribute} className="filter-row">
              <label className="filter__param">
                <input
                  onChange={() => handleApplyFilterParam(labelAttribute)}
                  type="checkbox"
                />
                <span className="filter__param-checkmark"></span>
                {labelAttribute}
              </label>
              {isFilterParamActive(labelAttribute) && (
                <Search
                  value={
                    activeFilterParams[labelAttribute as keyof FilterParams]
                      .value
                  }
                  onChange={(e: any) =>
                    handleFilterValueChange(labelAttribute, e.target.value)
                  }
                />
              )}
            </div>
          ))}
          {isFilterActive() && (
            <button
              className="standard-btn"
              disabled={isFilterEmpty()}
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          )}
        </div>
      </div>
      <Table>
        <Table.Header headers={mockedHeaders}></Table.Header>
        <Table.Body
          data={filteredData}
          render={label => <Table.Row key={label.id} label={label} />}
        ></Table.Body>
      </Table>
    </>
  )
}

export default TablePage
