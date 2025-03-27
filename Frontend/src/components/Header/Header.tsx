import { useContext } from 'react'
import AuthContext from '../../pages/AuthProvider'
import Modal from '../Modal/Modal'
import Settings from '../Settings/Settings'
import './Header.scss'

export default function Header() {
  const { user, isLoading } = useContext(AuthContext)!
  const userModal = 'user-modal'

  if (isLoading) return <div>Content loading</div>

  return (
    <>
      <Modal>
        <Modal>
          <Modal.Open opens={userModal}>
            <div className="header__user-info">{user?.email}</div>
          </Modal.Open>
          <Modal.Window name={userModal}>
            <Settings user={user!} />
          </Modal.Window>
        </Modal>
      </Modal>
    </>
  )
}
