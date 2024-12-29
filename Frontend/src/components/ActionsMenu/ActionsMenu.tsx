import { createContext, ReactNode, useContext, useState } from 'react'
import { HiEllipsisVertical } from 'react-icons/hi2'
import { Position } from '../../models/position'
import usePosition from '../../hooks/usePosition'
import './ActionsMenu.scss'

type MenuContextType = {
  openId: number
  open: (id: number) => void
  close: () => void
  handleSetPosition: (position: Position) => void
  position: Position | null
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

export default function ActionsMenu({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<number>(-1)
  const [position, setPosition] = useState<Position | null>(null)

  const open = (id: number) => setOpenId(id)

  const close = () => setOpenId(-1)

  const handleSetPosition = (position: Position): void => {
    setPosition(position)
  }

  return (
    <MenuContext.Provider
      value={{ openId, open, close, handleSetPosition, position }}
    >
      <div>{children}</div>
    </MenuContext.Provider>
  )
}

function ActionsMenuToggle({ id }: { id: number }) {
  const { open, close, openId, handleSetPosition } = useContext(MenuContext)!

  function handleClick(e: any) {
    e.stopPropagation()
    const rect = e.target.closest('button').getBoundingClientRect()
    const { bottom, right } = rect
    const position: Position = {
      x: right + 10,
      y: bottom - 30
    }

    if (openId !== id) {
      handleSetPosition(position)
      open(id)
    } else {
      close()
    }
  }

  return (
    <button className="menu-toggle" onClick={handleClick}>
      <HiEllipsisVertical />
    </button>
  )
}

function ActionsMenuBody({
  children,
  id
}: {
  children: ReactNode
  id: number
}) {
  const { openId, position } = useContext(MenuContext)!
  const ref = usePosition(openId, id, position)

  if (!id || id !== openId) return null
  return (
    <div ref={ref} className="menu-container">
      {children}
    </div>
  )
}

ActionsMenu.Body = ActionsMenuBody
ActionsMenu.Toggle = ActionsMenuToggle
