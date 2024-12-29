import { Product } from '../../models/product'
import ActionsMenu from '../ActionsMenu/ActionsMenu'
import CreateEditProductForm from '../CreateEditProductForm/CreateEditProductForm'
import Modal from '../Modal/Modal'

import './TableRow.css'
import { HiPencil, HiTrash } from 'react-icons/hi2'

export default function TableRow({ product }: { product: Product }) {
  const { name, price, producer } = product

  return (
    <div className="row">
      <div>{name}</div>
      <div>{price}</div>
      <div>{producer}</div>
      <Modal>
        <ActionsMenu>
          <div className="product-actions">
            <ActionsMenu.Toggle id={product.id} />
          </div>
          <ActionsMenu.Body id={product.id}>
            <button>
              <HiTrash color="#eb2727" />
            </button>
            <Modal.Open opens="product-form">
              <button>
                <HiPencil />
              </button>
            </Modal.Open>
          </ActionsMenu.Body>
        </ActionsMenu>
        <Modal.Window name="product-form">
          <CreateEditProductForm product={product} />
        </Modal.Window>
      </Modal>
    </div>
  )
}
