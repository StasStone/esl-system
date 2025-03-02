import { useForm } from 'react-hook-form'
import FormRow from '../FormRow/FormRow'
import './CreateEditProductForm.scss'
import { Product } from '../../models/product'
import useCreateProduct from '../../hooks/useCreateProduct'
import { useContext } from 'react'
import { ModalContext } from '../Modal/Modal'

export default function CreateEditProductForm({
  product = null
}: {
  product: Product | null
}) {
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: product ? product : {}
  })

  const { errors } = formState
  const { close } = useContext(ModalContext)!

  const { createProduct, isCreating } = useCreateProduct()

  function onError() {
    console.log(formState.errors)
  }

  function onSubmit(data: Product) {
    const newLabelString = data.labels.toString()
    const newLabels = newLabelString.split(',')
    createProduct({ ...data, labels: newLabels })
    close()
  }

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit, onError)}>
      <div className="form-container">
        <div className="form-column">
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
        </div>

        <div className="form-column">
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
        </div>
      </div>
      <FormRow>
        <button className="standard-btn" type="submit">
          {product ? 'Update Product' : 'Create Product'}
        </button>
      </FormRow>
    </form>
  )
}
