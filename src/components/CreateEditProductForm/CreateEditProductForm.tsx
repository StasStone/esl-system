import { Product } from '../../models/product'
import { useForm } from 'react-hook-form'

export default function CreateEditProductForm({
  product = null
}: {
  product: Product | null
}) {
  const { name, producer, price, discount } = product ? product : {}

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
      <div>
        <label></label>
        <input name="name" required type="text">
          {name}
        </input>
      </div>
      <div>
        <label></label>
        <input required name="producer" type="text">
          {producer}
        </input>
      </div>
      <div>
        <label></label>
        <input required name="price" type="text">
          {price}
        </input>
      </div>

      <div>
        <label></label>
        <input name="discount" type="text">
          {discount}
        </input>
      </div>

      <button type="submit">Submit</button>
    </form>
  )
}
