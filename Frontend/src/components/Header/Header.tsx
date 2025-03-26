import { useContext } from 'react'
import './Header.scss'
import AuthContext from '../../pages/AuthProvider'

export default function Header() {
  const { user } = useContext(AuthContext)!

  return (
    <header className="header__container">
      <div className="header__user-info">{user && user.email}</div>
    </header>
  )
}
