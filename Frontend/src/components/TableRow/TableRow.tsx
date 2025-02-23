import { ReactNode } from 'react'
import ActionsMenu from '../ActionsMenu/ActionsMenu'
import Modal from '../Modal/Modal'

import './TableRow.scss'
import { HiPencil, HiTrash } from 'react-icons/hi2'
import { rowClasses } from '../../models/columns'

type TableRowProps<T> = {
  item: T
  handleDeleteItem: () => void
  children: ReactNode
  modalName: string
}

export default function TableRow({
  item,
  children,
  handleDeleteItem,
  modalName
}: TableRowProps<any>) {
  const { id } = item
  const columns = Object.keys(item)
  const rowClass = rowClasses[columns.length - 1]
  return (
    <div className={rowClass}>
      {Object.keys(item).map(prop => (
        <div key={prop}>{item[prop]}</div>
      ))}
      <Modal>
        <ActionsMenu>
          <div className="actions">
            <ActionsMenu.Toggle id={id} />
          </div>
          <ActionsMenu.Body id={id}>
            <button onClick={handleDeleteItem}>
              <HiTrash color="#eb2727" />
            </button>
            <Modal.Open opens={modalName}>
              <button>
                <HiPencil />
              </button>
            </Modal.Open>
          </ActionsMenu.Body>
        </ActionsMenu>
        <Modal.Window name={modalName}>{children}</Modal.Window>
      </Modal>
    </div>
  )
}
