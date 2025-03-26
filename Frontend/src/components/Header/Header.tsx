import { useContext } from 'react'
import './Header.scss'
import AuthContext from '../../pages/AuthProvider'

export default function Header() {
  const { user } = useContext(AuthContext)!

  function handleUserClick() {
    console.log('Click')
  }
  return (
    <header className="header__container">
      <div onClick={handleUserClick} className="header__user-info">
        {user && user.email}
      </div>
    </header>
  )
}
