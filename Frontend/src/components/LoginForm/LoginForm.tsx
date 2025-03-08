import { User, userEmpty } from '../../models/user'
import FormRow from '../FormRow/FormRow'
import './LoginForm.scss'
import { useForm } from 'react-hook-form'

export default function LoginForm() {
  const { register, handleSubmit, formState } = useForm({
    defaultValues: userEmpty
  })
  const { errors } = formState

  function onSubmit(data: User) {
    console.log(data)
  }

  function onError() {}

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="email" error={errors.email!.message}>
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
        <button className="btn-standard">Login</button>
      </FormRow>
    </form>
  )
}
