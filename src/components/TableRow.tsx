import { Product } from '../models/product'
import './TableRow.css'

export default function TableRow({ product }: { product: Product }) {
  const { name, price, producer } = product

  function handleDelete(): void {}

  function handleEdit(): void {}

  return (
    <div className="row">
      <div>{name}</div>
      <div>{price}</div>
      <div>{producer}</div>
      <div className="produc-actions">
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleEdit}>Edit</button>
      </div>
    </div>
  )
}
