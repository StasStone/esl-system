import { useEffect, useState } from 'react'
import Table from '../components/Table/Table'

import {
  defaultProductFilterParams,
  Product,
  productAttributes,
  ProductFilterParams
} from '../models/product'
import CreateEditProductForm from '../components/CreateEditProductForm/CreateEditProductForm'
import Filter from '../components/Filter/Filter'
import useFilter from '../hooks/useFilter'
import useDeleteProduct from '../hooks/useDeleteProduct'
import './ProductsTablePage.scss'
import Modal from '../components/Modal/Modal'

function ProductsTablePage() {
  const productTableHeaders = [
    'id',
    'name',
    'price',
    'discount',
    'producer',
    'labels'
  ]

  const [filteredData, setFilteredData] = useState<Partial<Product>[]>([])
  const [activeFilterParams, setActiveFilterParams] =
    useState<ProductFilterParams>(defaultProductFilterParams)
  const [appliedFilterParams, setAppliedFilterParams] =
    useState<ProductFilterParams>(defaultProductFilterParams)
  const { isFilterActive, isFilterEmpty } = useFilter(activeFilterParams)
  const { deleteProduct } = useDeleteProduct()
  const modalName = 'product-form'

  useEffect(() => {
    const getData = async function (filters: ProductFilterParams) {
      const res = await fetch('http://localhost:7071/api/products', {
        method: 'POST',
        body: JSON.stringify(filters)
      })
      const data = await res.json()
      console.log(data)
      if (data && data.products) setFilteredData(data.products)
    }

    if (isFilterActive() && !isFilterEmpty()) {
      getData(activeFilterParams)
    }
    if (isFilterEmpty() || !isFilterActive()) {
      getData(defaultProductFilterParams)
    }
  }, [appliedFilterParams])

  function handleApplyFilters(productFilter: ProductFilterParams): void {
    setAppliedFilterParams(productFilter)
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
      <div className="create-product-container">
        <Modal>
          <Modal>
            <Modal.Open opens={modalName}>
              <button>Add new product</button>
            </Modal.Open>
            <Modal.Window name={modalName}>
              <CreateEditProductForm product={null} />
            </Modal.Window>
          </Modal>
        </Modal>
      </div>
      <Table>
        <Table.Header headers={productTableHeaders}></Table.Header>
        <Table.Body
          data={filteredData}
          render={product => (
            <Table.Row
              modalName={modalName}
              key={product.id}
              item={product}
              handleDeleteItem={() =>
                deleteProduct(product.id, product.producer)
              }
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
