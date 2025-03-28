import { useContext } from 'react'
import useUser from '../../hooks/useUser'
import FormRow from '../FormRow/FormRow'
import { useForm } from 'react-hook-form'
import AuthContext from '../../pages/AuthProvider'
import './Settings.scss'
import { User } from '../../models/user'

export default function Settings({ user }: { user: User }) {
  const { register, handleSubmit, formState } = useForm({
    defaultValues: { email: user.email, password: '' }
  })
  const { errors } = formState

  const { updateUser } = useUser()

  const { clearToken } = useContext(AuthContext)!

  function onSubmit(data: any) {
    updateUser({ ...user, ...data })
    clearToken()
  }

  function onError() {}

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="email" error={errors.email?.message}>
        <input
          type="email"
          id="email"
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
        <button className="standard-btn">Save</button>
      </FormRow>
    </form>
  )
}
