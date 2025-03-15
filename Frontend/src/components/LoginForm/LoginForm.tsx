import { useNavigate } from 'react-router-dom'
import useLogin from '../../hooks/useLogin'
import useSignup from '../../hooks/useSignup'
import { User, userEmpty } from '../../models/user'
import FormRow from '../FormRow/FormRow'
import './LoginForm.scss'
import { useForm } from 'react-hook-form'

export default function LoginForm() {
  const { register, handleSubmit, formState } = useForm({
    defaultValues: userEmpty
  })
  const navigate = useNavigate()
  const { errors } = formState
  const { login } = useLogin()
  const { signup } = useSignup()

  function onSubmit(data: User) {
    // login(data.email, data.password)
    signup(data.email, data.password)
    navigate('/labels')
  }

  function onError() {}

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="email" error={errors.email?.message}>
        <input
          type="email"
          id="email"
          // This makes this form better for password managers
          autoComplete="username"
          {...register('email', { required: 'Email is required' })}
        />
      </FormRow>
      <FormRow label="password" error={errors.password?.message}>
        <input
          type="password"
          id="password"
          autoComplete="current-password"
          {...register('password', { required: 'Password is required' })}
        />
      </FormRow>
      <FormRow>
        <button className="standard-btn">Login</button>
      </FormRow>
    </form>
  )
}
