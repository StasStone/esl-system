import { Product } from '../models/product'
import ActionsMenu from './ActionsMenu'
import './TableRow.css'

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
          <button>Delete</button>
          <button>Edit</button>
        </ActionsMenu.Body>
      </ActionsMenu>
    </div>
  )
}
