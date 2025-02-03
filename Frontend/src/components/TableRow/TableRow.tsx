import { Label } from '../../models/label'
import ActionsMenu from '../ActionsMenu/ActionsMenu'
import CreateEditProductForm from '../CreateEditProductForm/CreateEditProductForm'
import Modal from '../Modal/Modal'

import './TableRow.scss'
import { HiPencil, HiTrash } from 'react-icons/hi2'

export default function TableRow({ label }: { label: Label }) {
  const { name, price, producer } = label

  return (
    <div className="table__row">
      <div>{name}</div>
      <div>{price}</div>
      <div>{producer}</div>
      <Modal>
        <ActionsMenu>
          <div className="product-actions">
            <ActionsMenu.Toggle id={label.id} />
          </div>
          <ActionsMenu.Body id={label.id}>
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
          <CreateEditProductForm label={label} />
        </Modal.Window>
      </Modal>
    </div>
  )
}
