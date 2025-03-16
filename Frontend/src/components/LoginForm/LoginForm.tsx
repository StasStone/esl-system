import useLogin from '../../hooks/useLogin'
import useSignup from '../../hooks/useSignup'
import { User, userEmpty } from '../../models/user'
import FormRow from '../FormRow/FormRow'
import './LoginForm.scss'
import { useForm } from 'react-hook-form'

export default function LoginForm({ isSignUp }: { isSignUp: boolean }) {
  const { register, handleSubmit, formState } = useForm({
    defaultValues: userEmpty
  })
  const { errors } = formState

  const { login, error: loginError } = useLogin()
  const { signup, error: signupError } = useSignup()

  function onSubmit(data: User) {
    if (isSignUp) {
      signup(data.email, data.password, data.store_id)
    } else {
      login(data.email, data.password)
    }
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

      {isSignUp && (
        <FormRow label="store_id" error={errors.store_id?.message}>
          <input
            type="text"
            id="store_id"
            autoComplete="current-password"
            {...register('store_id', { required: 'Store id is required' })}
          />
        </FormRow>
      )}
      <FormRow>
        <button className="standard-btn">
          {isSignUp ? 'Sign up' : 'Login'}
        </button>
      </FormRow>
    </form>
  )
}
