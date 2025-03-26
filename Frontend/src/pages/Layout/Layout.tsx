import { Outlet } from 'react-router-dom'
import './Layout.scss'
import SideNavigation from '../../components/SideNavigation/SideNavigation'
import { Link } from '../../models/template-link'
import { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
const AppLayout = () => {
  const [routes, setRoutes] = useState<Link[]>([])

  useEffect(() => {
    const getTemplates = async () => {
      const res = await fetch('http://localhost:7071/api/templates', {
        method: 'GET'
      })
      const data = await res.json()
      const { templates } = data

      const templateLinks: Link[] = templates.map((template: any) => ({
        name: template.template_id,
        link: template.template_id
      }))
      const firstSublink = templateLinks[0].link

      const builtRouts = [
        { name: 'labels', link: 'labels' },
        { name: 'products', link: 'products' },
        {
          name: 'templates',
          subLinks: templateLinks,
          link: `templates/${firstSublink}`
        }
      ]
      setRoutes(builtRouts)
    }

    getTemplates()
  }, [])

  return (
    <div className="layout">
      <Header />
      <aside className="sidebar">
        <SideNavigation links={routes} />
      </aside>
      <div className="main">
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout
