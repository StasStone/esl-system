import { useState } from 'react'
import LoginForm from '../../components/LoginForm/LoginForm'
import './LoginPage.scss'
export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <div className="login-layout">
      <LoginForm isSignUp={isSignUp} />
      <p>
        Would you like to{' '}
        <span
          className="signup__link"
          onClick={() => setIsSignUp(signUp => !signUp)}
        >
          sign up{' '}
        </span>
        instead?
      </p>
    </div>
  )
}
