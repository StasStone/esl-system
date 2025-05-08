import { useContext } from 'react'
import useUser from '../../hooks/useUser'
import FormRow from '../FormRow/FormRow'
import { useForm } from 'react-hook-form'
import AuthContext from '../../pages/AuthProvider'
import './Settings.scss'
import { UserInfo } from '../../models/user'

export default function Settings({ user }: { user: UserInfo }) {
  const { register, handleSubmit, formState } = useForm({
    defaultValues: { email: user.email, password: 'old', interval: 20 }
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
      <FormRow label="Email" error={errors.email?.message}>
        <input
          type="email"
          id="email"
          autoComplete="username"
          {...register('email', { required: 'Email is required' })}
        />
      </FormRow>
      <FormRow label="Password" error={errors.password?.message}>
        <input
          type="password"
          id="password"
          autoComplete="current-password"
          {...register('password', { required: 'Password is required' })}
        />
      </FormRow>
      <FormRow label="Updates Interval">
        <input type="number" id="interval" {...register('interval')} />
      </FormRow>
      <FormRow>
        <button className="standard-btn">Save</button>
      </FormRow>
    </form>
  )
}
