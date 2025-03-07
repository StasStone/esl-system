import { useForm } from 'react-hook-form'
import FormRow from '../FormRow/FormRow'
import './EditLabelForm.scss'
import { useContext } from 'react'
import { ModalContext } from '../Modal/Modal'
import { v4 as uuidv4 } from 'uuid'
import { Label } from '../../models/label'

export default function EditLabelForm({
  label = null
}: {
  label: Label | null
}) {
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: label ? label : {}
  })

  const { errors } = formState
  const { close } = useContext(ModalContext)!

  function onError() {
    console.log(formState.errors)
  }

  function onSubmit(data: Label) {
    const newID = label ? label.id : uuidv4()
    close()
  }

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="product_id" error={errors.product_id?.message}>
        <input
          className="form-input"
          type="text"
          id="product_id"
          {...register('product_id', { required: 'product_id is required' })}
        />
      </FormRow>
      <FormRow>
        <button className="standard-btn" type="submit">
          {label ? 'Update Label' : 'Create Label'}
        </button>
      </FormRow>
    </form>
  )
}
