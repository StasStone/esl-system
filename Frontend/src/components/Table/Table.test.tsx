import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Table from './Table'
import CreateEditProductForm from '../CreateEditProductForm/CreateEditProductForm'

// Mock data
const productTableHeaders = ['Name', 'Category', 'Price']
const mockProducts = [
  {
    id: '1',
    name: 'Product A',
    category: 'Category X',
    price: 100,
    producer: 'Producer A',
    updating: false
  },
  {
    id: '2',
    name: 'Product B',
    category: 'Category Y',
    price: 200,
    producer: 'Producer B',
    updating: true
  }
]

// Mock modal name and delete function
const modalName = 'EditProduct'
const deleteProduct = jest.fn()

describe('Table Component', () => {
  it('renders headers and product rows correctly', () => {
    render(
      <Table>
        <Table.Header headers={productTableHeaders} />
        <Table.Body
          data={mockProducts}
          render={product => (
            <Table.Row
              modalName={modalName}
              key={product.id}
              item={product}
              outlined={product.updating}
              handleDeleteItem={() =>
                deleteProduct(product.id, product.producer)
              }
            >
              <CreateEditProductForm product={product} />
            </Table.Row>
          )}
        />
      </Table>
    )

    // Check for headers
    productTableHeaders.forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument()
    })

    // Check for product names (as a way to confirm data rendering)
    mockProducts.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument()
    })
  })
})
