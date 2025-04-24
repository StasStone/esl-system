import FormRow from '../FormRow/FormRow'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { ModalContext } from '../Modal/Modal'

export default function CreateTemplateForm({
  onCreateTemplate
}: {
  onCreateTemplate: (title: string) => void
}) {
  const { register, handleSubmit, formState } = useForm({
    defaultValues: { title: '' }
  })
  const { errors } = formState

  const { close } = useContext(ModalContext)!

  function onSubmit(data: any) {
    console.log('Template title:', data)
    onCreateTemplate(data.title)
    close()
  }

  function onError() {}

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="Template title" error={errors.title?.message}>
        <input
          placeholder="Template title..."
          type="text"
          id="title"
          {...register('title', { required: 'Title is required' })}
        />
      </FormRow>
      <FormRow>
        <button className="standard-btn">Save Template</button>
      </FormRow>
    </form>
  )
}
