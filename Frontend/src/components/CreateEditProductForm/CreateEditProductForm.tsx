import { Product } from '../../models/product'
import { useForm } from 'react-hook-form'
import FormRow from '../FormRow/FormRow'
import './CreateEditProductForm.css'

export default function CreateEditProductForm({
  product = null
}: {
  product: Product | null
}) {
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: product ? product : {}
  })

  function onError() {
    console.log(formState.errors)
  }

  function onSubmit() {
    console.log(formState)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="name">
        <input
          className="form-input"
          type="text"
          id="name"
          {...register('name', { required: 'Title is required' })}
        />
      </FormRow>
      <FormRow label="producer">
        <input
          className="form-input"
          type="text"
          id="producer"
          {...register('producer', { required: 'Producer is required' })}
        />
      </FormRow>
      <FormRow label="price">
        <input
          className="form-input"
          type="text"
          id="price"
          {...register('price', {
            required: 'Price is required',
            min: { value: 1, message: 'Price should be at least 1' }
          })}
        />
      </FormRow>
      <FormRow label="discount">
        <input
          className="form-input"
          defaultValue={0}
          id="discount"
          type="number"
          {...register('discount', {
            required: 'The discount is required',
            validate: value =>
              value! <= getValues().price ||
              'Discount should be less than regular price'
          })}
        />
      </FormRow>
      <button type="submit">Submit</button>
    </form>
  )
}
