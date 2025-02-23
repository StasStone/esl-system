import { useForm } from 'react-hook-form'
import FormRow from '../FormRow/FormRow'
import './CreateEditProductForm.scss'
import { Product } from '../../models/product'

export default function CreateEditProductForm({
  product = null
}: {
  product: Product | null
}) {
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: product ? product : {}
  })

  const { errors } = formState

  function onError() {
    console.log(formState.errors)
  }

  function onSubmit(data: any) {
    console.log(data)
  }

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="name" error={errors?.name?.message}>
        <input
          className="form-input"
          type="text"
          id="name"
          {...register('name', { required: 'Name is required' })}
        />
      </FormRow>
      <FormRow label="producer" error={errors.producer?.message}>
        <input
          className="form-input"
          type="text"
          id="producer"
          {...register('producer', { required: 'Producer is required' })}
        />
      </FormRow>
      <FormRow label="price" error={errors.price?.message}>
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
      <FormRow label="sku" error={errors.sku?.message}>
        <input
          className="form-input"
          type="text"
          id="sku"
          {...register('sku', {
            required: 'sku is required'
          })}
        />
      </FormRow>
      <FormRow label="discount" error={errors.discount?.message}>
        <input
          className="form-input"
          defaultValue={0}
          id="discount"
          type="float"
          {...register('discount', {
            validate: value =>
              value! <= getValues().price ||
              'Discount should be less than regular price'
          })}
        />
      </FormRow>
      <FormRow label="labels" error={errors.labels?.message}>
        <input
          className="form-input"
          type="text"
          id="labels"
          {...register('labels', { required: 'Label id is required' })}
        />
      </FormRow>
      <FormRow label="inventory_count" error={errors.inventory_count?.message}>
        <input
          className="form-input"
          type="number"
          id="inventory_count"
          {...register('inventory_count', {
            validate: value =>
              value! <= getValues().inventory_count ||
              'Discount shouldn`t be less than 0'
          })}
        />
      </FormRow>
      <FormRow>
        <button className="standard-btn" type="submit">
          {product ? 'Update Product' : 'Create Product'}
        </button>
      </FormRow>
    </form>
  )
}
