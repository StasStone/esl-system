import { useEffect, useState } from 'react'
import Table from '../../components/Table/Table'

import {
  defaultProductFilterParams,
  Product,
  productAttributes,
  ProductFilterParams
} from '../../models/product'
import { applyFilters } from '../../models/filter-param'
import CreateEditProductForm from '../../components/CreateEditProductForm/CreateEditProductForm'
import Filter from '../../components/Filter/Filter'

function ProductsTablePage() {
  const productTableHeaders = [
    'id',
    'name',
    'price',
    'discount',
    'producer',
    'inventory_count'
  ]

  const [filteredData, setFilteredData] = useState<Partial<Product>[]>([])
  const [activeFilterParams, setActiveFilterParams] =
    useState<ProductFilterParams>(defaultProductFilterParams)

  useEffect(() => {
    const getData = async function () {
      const res = await fetch('http://localhost:7071/api/products')
      const data = await res.json()
      console.log(data)
      setFilteredData(data.products)
    }

    getData()
  }, [activeFilterParams])

  function handleApplyFilters(productFilter: ProductFilterParams): void {
    const newFilteredData = applyFilters<Partial<Product>>(
      filteredData,
      productFilter
    )

    setFilteredData(newFilteredData)
  }

  function handleDeleteItem() {
    console.log('item deleted')
  }

  return (
    <>
      <Filter
        activeFilterParams={activeFilterParams}
        setActiveFilterParams={setActiveFilterParams}
        handleApplyFilters={handleApplyFilters}
        attributes={productAttributes}
        defaultFilterParams={defaultProductFilterParams}
      />
      <Table>
        <Table.Header headers={productTableHeaders}></Table.Header>
        <Table.Body
          data={filteredData}
          render={product => (
            <Table.Row
              key={product.id}
              item={product}
              handleDeleteItem={handleDeleteItem}
            >
              <CreateEditProductForm product={product} />
            </Table.Row>
          )}
        ></Table.Body>
      </Table>
    </>
  )
}

export default ProductsTablePage
