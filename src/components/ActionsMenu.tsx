import { createContext, ReactNode, useContext, useState } from 'react'

type MenuContextType = {
  openId: number
  open: (id: number) => void
  close: () => void
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

export default function ActionsMenu({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState(-1)

  const open = (id: number) => setOpenId(id)

  const close = () => setOpenId(-1)

  return (
    <MenuContext.Provider value={{ openId, open, close }}>
      <div>{children}</div>
    </MenuContext.Provider>
  )
}

function ActionsMenuToggle({ id }: { id: number }) {
  const { open } = useContext(MenuContext)!

  function handleClick(e: any) {
    open(id)
    console.log(e.target.closest)
  }

  return <div onClick={handleClick}>toggle</div>
}

function ActionsMenuBody({
  children,
  id
}: {
  children: ReactNode
  id: number
}) {
  const { openId } = useContext(MenuContext)!

  if (!id || id !== openId) return null
  return <div className="menu-container">{children}</div>
}

ActionsMenu.Body = ActionsMenuBody
ActionsMenu.Toggle = ActionsMenuToggle
