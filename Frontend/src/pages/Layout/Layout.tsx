import { Outlet } from 'react-router-dom'
import './Layout.scss'

const AppLayout = () => {
  return (
    <div className="layout">
      <header>Header</header>
      <aside className="sidebar">
        <div>table</div>
        <div>template</div>
      </aside>
      <div className="main">
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout
