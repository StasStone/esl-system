import { ReactNode } from 'react'
import ActionsMenu from '../ActionsMenu/ActionsMenu'
import Modal from '../Modal/Modal'

import './TableRow.scss'
import { HiPencil, HiTrash } from 'react-icons/hi2'

type TableRowProps<T> = {
  item: T
  handleDeleteItem: () => void
  children: ReactNode
}

export default function TableRow({
  item,
  children,
  handleDeleteItem
}: TableRowProps<any>) {
  const { id } = item

  return (
    <div className="table__row">
      {Object.keys(item).map(prop => (
        <div>{item[prop]}</div>
      ))}
      <Modal>
        <ActionsMenu>
          <div className="product-actions">
            <ActionsMenu.Toggle id={id} />
          </div>
          <ActionsMenu.Body id={id}>
            <button onClick={handleDeleteItem}>
              <HiTrash color="#eb2727" />
            </button>
            <Modal.Open opens="product-form">
              <button>
                <HiPencil />
              </button>
            </Modal.Open>
          </ActionsMenu.Body>
        </ActionsMenu>
        <Modal.Window name="product-form">{children}</Modal.Window>
      </Modal>
    </div>
  )
}
