import { useNavigate } from 'react-router-dom'
import './SideNavigation.scss'
import { useState } from 'react'
import { Link } from '../../models/template-link'

function SideNavigation({ links }: { links: Link[] }) {
  const [activeLink, setActiveLink] = useState<string | undefined>()
  const navigate = useNavigate()
  const activeLinkClass = 'nav__link-active'

  const handleNavigate = (link: string) => {
    navigate(link)
    setActiveLink(link)
  }
  return (
    <nav className="nav__container">
      {links.map(link => {
        return (
          <div
            key={link.name}
            className={
              activeLink === link.link
                ? activeLinkClass
                : link.subLinks
                  ? 'nav__link-with-subs'
                  : 'nav__link'
            }
            onClick={() => handleNavigate(link.link)}
          >
            {link.name}
            <div>
              {link.subLinks &&
                link.subLinks.map((subLink: Link) => (
                  <div
                    key={subLink.name}
                    className={
                      activeLink === subLink.link
                        ? activeLinkClass
                        : 'nav__link'
                    }
                    onClick={() => handleNavigate(subLink.link)}
                  >
                    {subLink.name}
                  </div>
                ))}
            </div>
          </div>
        )
      })}
    </nav>
  )
}

export default SideNavigation
