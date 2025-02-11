import { Outlet } from 'react-router-dom'
import './Layout.scss'
import SideNavigation from '../../components/SideNavigation/SideNavigation'

const AppLayout = () => {
  return (
    <div className="layout">
      <header>Header</header>
      <aside className="sidebar">
        <SideNavigation links={['table', 'template']} />
      </aside>
      <div className="main">
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout
