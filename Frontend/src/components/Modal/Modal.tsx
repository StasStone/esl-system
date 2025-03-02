import { cloneElement, createContext, useContext, useState } from 'react'
import './Modal.scss'
import { HiXMark } from 'react-icons/hi2'

type ModalContext = {
  close: () => void
  open: (name: string) => void
  openName: string
}

export const ModalContext = createContext<ModalContext | undefined>(undefined)

export default function Modal({ children }: { children: any }) {
  const [openName, setOpenName] = useState('')

  const close = () => setOpenName('')

  const open = setOpenName

  return (
    <ModalContext.Provider value={{ openName, open, close }}>
      {children}
    </ModalContext.Provider>
  )
}

function Open({ opens, children }: { opens: string; children: any }) {
  const { open } = useContext(ModalContext)!
  return cloneElement(children, { onClick: () => open(opens) })
}

function Window({ name, children }: { name: string; children: any }) {
  const { openName, close } = useContext(ModalContext)!
  if (name !== openName) return null

  return (
    <div className="overlay">
      <div className="modal-container">
        <button className="close-btn" onClick={close}>
          <HiXMark />
        </button>
        {children}
      </div>
    </div>
  )
}

Modal.Window = Window
Modal.Open = Open
