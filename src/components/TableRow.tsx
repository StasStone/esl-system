import { Product } from '../models/product'
import './TableRow.css'

export default function TableRow({ product }: { product: Product }) {
  const { name, price, producer } = product
  return (
    <div className="row">
      <div>{name}</div>
      <div>{price}</div>
      <div>{producer}</div>
    </div>
  )
}
