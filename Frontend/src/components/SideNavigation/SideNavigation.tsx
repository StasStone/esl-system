import { useNavigate } from 'react-router-dom'
import './SideNavigation.scss'

function SideNavigation({ links }: { links: string[] }) {
  const navigate = useNavigate()
  return (
    <div className="nav__container">
      {links.map(link => (
        <div
          key={link}
          className="nav__link"
          onClick={() => handleNavigate(link)}
        >
          {link}
        </div>
      ))}
    </div>
  )

  function handleNavigate(link: string) {
    navigate(link)
  }
}

export default SideNavigation
