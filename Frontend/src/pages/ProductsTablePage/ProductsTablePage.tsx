import { useEffect, useState } from 'react'
import Table from '../../components/Table/Table'
import Search from '../../components/Search/Search'
import { mockedData } from '../../mocks/mock-data'
import { mockedHeaders } from '../../mocks/mock-headers'

import './ProductsTablePage.scss'
import {
  DefaultFilterParams,
  Product,
  productAttributes,
  ProductFilterParams
} from '../../models/product'
import CreateEditProductForm from '../../components/CreateEditProductForm/CreateEditProductForm'

function ProductsTablePage() {
  const [activeFilterParams, setActiveFilterParams] =
    useState<ProductFilterParams>(DefaultFilterParams)

  const [filteredData, setFilteredData] = useState<Product[]>([])

  function handleApplyFilters(): void {
    const newFilteredData = mockedData.filter(data =>
      Object.entries(activeFilterParams).every(([key, filter]) => {
        if (!filter.active || !filter.value) return true

        const dataValue = data[key as keyof Product]
        return dataValue?.toString().toLowerCase() === filter.value
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

  function isFilterParamActive(
    filterParam: keyof ProductFilterParams
  ): boolean {
    return activeFilterParams[filterParam].active
  }

  function handleApplyFilterParam(filterParam: keyof ProductFilterParams) {
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
        ...prev[filterParam as keyof ProductFilterParams],
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
          {productAttributes.map(productAttribute => (
            <div key={productAttribute} className="filter-row">
              <label className="filter__param">
                <input
                  onChange={() => handleApplyFilterParam(productAttribute)}
                  type="checkbox"
                />
                <span className="filter__param-checkmark"></span>
                {productAttribute}
              </label>
              {isFilterParamActive(productAttribute) && (
                <Search
                  value={activeFilterParams[
                    productAttribute as keyof ProductFilterParams
                  ].value.toString()}
                  onChange={(e: any) =>
                    handleFilterValueChange(productAttribute, e.target.value)
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
          render={product => (
            <Table.Row key={product.id} item={product}>
              <CreateEditProductForm product={product} />
            </Table.Row>
          )}
        ></Table.Body>
      </Table>
    </>
  )
}

export default ProductsTablePage
