import './NotFoundPage.scss'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  const moveBack = () => navigate(-1)

  return (
    <div className="not-found__wrapper">
      <div className="not-found__container">
        <h1>The page you are looking for could not be found 😢</h1>
        <button className="standard-btn" onClick={moveBack}>
          &larr; Go back
        </button>
      </div>
    </div>
  )
}
