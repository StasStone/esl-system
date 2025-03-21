import { useNavigate } from 'react-router-dom'
import './SideNavigation.scss'
import { useState } from 'react'
function SideNavigation({ links }: { links: string[] }) {
  const [activeLink, setActiveLink] = useState<string>()
  const navigate = useNavigate()
  const activeLinkClass = 'nav__link-active'

  return (
    <nav className="nav__container">
      {links.map(link => (
        <div
          key={link}
          className={activeLink == link ? activeLinkClass : 'nav__link'}
          onClick={() => handleNavigate(link)}
        >
          {link}
        </div>
      ))}
    </nav>
  )

  function handleNavigate(link: string) {
    navigate(link)
    setActiveLink(link)
  }
}

export default SideNavigation
