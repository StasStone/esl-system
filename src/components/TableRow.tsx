import { Product } from '../models/product'
import ActionsMenu from './ActionsMenu'
import './TableRow.css'
import { HiPencil, HiTrash } from 'react-icons/hi2'

export default function TableRow({ product }: { product: Product }) {
  const { name, price, producer } = product

  return (
    <div className="row">
      <div>{name}</div>
      <div>{price}</div>
      <div>{producer}</div>
      <ActionsMenu>
        <div className="product-actions">
          <ActionsMenu.Toggle id={product.id} />
        </div>
        <ActionsMenu.Body id={product.id}>
          <button>
            <HiTrash />
          </button>
          <button>
            <HiPencil />
          </button>
        </ActionsMenu.Body>
      </ActionsMenu>
    </div>
  )
}
