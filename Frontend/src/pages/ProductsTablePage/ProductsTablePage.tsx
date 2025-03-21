import { useState, useEffect } from 'react'
import CreateEditProductForm from '../../components/CreateEditProductForm/CreateEditProductForm'
import Filter from '../../components/Filter/Filter'
import Modal from '../../components/Modal/Modal'
import Table from '../../components/Table/Table'
import useDeleteProduct from '../../hooks/useDeleteProduct'
import useFilter from '../../hooks/useFilter'
import {
  Product,
  ProductFilterParams,
  defaultProductFilterParams,
  productAttributes
} from '../../models/product'
import Pagination from '../../components/Pagination/Pagination'
import Loader from '../../components/Loader/Loader'

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
  const [continuationToken, setContinuationToken] = useState<string | null>(
    null
  )
  const [previousTokens, setPreviousTokens] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const limit = 10
  const modalName = 'product-form'

  const getData = async function (
    filters: ProductFilterParams,
    token: string | null
  ) {
    setLoading(true)
    const res = await fetch('http://localhost:7071/api/products', {
      method: 'POST',
      body: JSON.stringify({ filters, limit, continuationToken: token })
    })
    const data = await res.json()
    console.log(data)
    if (data && data.products) {
      setFilteredData(data.products)
      setContinuationToken(data.continuationToken || null)

      if (token && !previousTokens.includes(token)) {
        setPreviousTokens([...previousTokens, token])
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    if (isFilterActive() && !isFilterEmpty()) {
      getData(activeFilterParams, null)
    }
    if (isFilterEmpty() || !isFilterActive()) {
      getData(defaultProductFilterParams, null)
    }
  }, [appliedFilterParams, loading])

  function handleApplyFilters(productFilter: ProductFilterParams): void {
    setAppliedFilterParams(productFilter)
    setPreviousTokens([])
    setContinuationToken(null)
  }

  function handleNextPage() {
    if (continuationToken) {
      getData(appliedFilterParams, continuationToken)
    }
  }

  function handlePreviousPage() {
    if (previousTokens.length > 1) {
      const newTokens = [...previousTokens]
      newTokens.pop()
      setPreviousTokens(newTokens)
      getData(appliedFilterParams, newTokens[newTokens.length - 1] || null)
    }
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
              <button className="standard-btn">Add new product</button>
            </Modal.Open>
            <Modal.Window name={modalName}>
              <CreateEditProductForm product={null} />
            </Modal.Window>
          </Modal>
        </Modal>
      </div>
      {loading ? (
        <Loader width="1rem" height="1rem" />
      ) : (
        <div>
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
          <Pagination
            onNext={handleNextPage}
            onPrev={handlePreviousPage}
            continuationToken={continuationToken}
            previousTokens={previousTokens}
          />
        </div>
      )}
    </>
  )
}

export default ProductsTablePage
