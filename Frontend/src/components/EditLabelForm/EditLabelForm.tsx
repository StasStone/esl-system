import { useForm } from 'react-hook-form'
import FormRow from '../FormRow/FormRow'
import './EditLabelForm.scss'
import { useContext } from 'react'
import { ModalContext } from '../Modal/Modal'
import { Label } from '../../models/label'
import { useCreateLabel } from '../../hooks/useCreateLabel'
import { v4 as uuidv4 } from 'uuid'

export default function EditLabelForm({
  label = null
}: {
  label: Label | null
}) {
  const { register, handleSubmit, formState } = useForm({
    defaultValues: label ? label : {}
  })

  const { errors } = formState
  const { close } = useContext(ModalContext)!
  const { createLabel } = useCreateLabel()

  function onError() {
    console.log(formState.errors)
  }

  function onSubmit(data: Label) {
    const newID = label ? label.id : uuidv4()
    createLabel({ ...data, id: newID })
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
