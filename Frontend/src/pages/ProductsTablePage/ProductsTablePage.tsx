import { useState, useEffect } from 'react'
import CreateEditProductForm from '../../components/CreateEditProductForm/CreateEditProductForm'
import Filter from '../../components/Filter/Filter'
import Modal from '../../components/Modal/Modal'
import Table from '../../components/Table/Table'
import useDeleteProduct from '../../hooks/useDeleteProduct'
import useProducts from '../../hooks/useProducts'
import {
  Product,
  ProductFilterParams,
  defaultProductFilterParams,
  productAttributes
} from '../../models/product'
import Pagination from '../../components/Pagination/Pagination'
import Loader from '../../components/Loader/Loader'
import './ProductsTablePage.scss'
import { PRODUCT_MODAL, PRODUCT_TABLE_HEADERS } from '../../utils/constants'
import { useSearchParams } from 'react-router-dom'
import ProductUploader from '../../components/ProductUploader/ProductUploader'

function ProductsTablePage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [activeFilterParams, setActiveFilterParams] =
    useState<ProductFilterParams>(defaultProductFilterParams)
  const [appliedFilterParams, setAppliedFilterParams] =
    useState<ProductFilterParams>(defaultProductFilterParams)
  const [continuationToken, setContinuationToken] = useState<string | null>(
    null
  )
  const [previousTokens, setPreviousTokens] = useState<string[]>([])

  const { deleteProduct } = useDeleteProduct()
  const { isLoading, products } = useProducts()

  useEffect(() => {
    productAttributes.forEach(attribute => {
      const filterValue = String(activeFilterParams[attribute]!.value)
      if (filterValue !== '') {
        searchParams.set(attribute, filterValue)
      } else {
        searchParams.delete(attribute)
      }
    })
    searchParams.set('page', '')
    setSearchParams(searchParams)
  }, [appliedFilterParams])

  function handleApplyFilters(productFilter: ProductFilterParams): void {
    setAppliedFilterParams(productFilter)
    setPreviousTokens([])
    setContinuationToken(null)
  }

  function handleNextPage() {
    if (continuationToken) {
      searchParams.set('page', continuationToken)
    }
  }

  function handlePreviousPage() {
    if (previousTokens.length > 1) {
      const newTokens = [...previousTokens]
      newTokens.pop()
      setPreviousTokens(newTokens)
      const previousToken = newTokens[newTokens.length - 1]
      searchParams.set('page', previousToken)
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
        <ProductUploader />
        <Modal>
          <Modal>
            <Modal.Open opens={PRODUCT_MODAL}>
              <button className="standard-btn">Add new product</button>
            </Modal.Open>
            <Modal.Window name={PRODUCT_MODAL}>
              <CreateEditProductForm product={null} />
            </Modal.Window>
          </Modal>
        </Modal>
      </div>
      {isLoading ? (
        <div className="table__loader">
          <Loader width="1rem" height="1rem" />
        </div>
      ) : (
        <div>
          <Table>
            <Table.Header headers={PRODUCT_TABLE_HEADERS}></Table.Header>
            <Table.Body
              data={products}
              render={(product: Product) => (
                <Table.Row
                  modalName={PRODUCT_MODAL}
                  key={product.id}
                  item={product}
                  outlined={product.updating}
                  handleDeleteItem={() =>
                    deleteProduct({
                      id: product.id,
                      partition: product.producer
                    })
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
