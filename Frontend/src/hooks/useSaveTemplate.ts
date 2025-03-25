import { useState } from 'react'
import { Template, TemplateItems } from '../models/draggable-item'
import { v4 as uuidv4 } from 'uuid'
export default function useSaveTemplate() {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const createTemplate = async (
    templateItems: TemplateItems,
    store_id: string
  ) => {
    setIsCreating(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const newTemplate: Template = {
        template_id: uuidv4(),
        items: templateItems,
        store_id: store_id,
        current: true
      }

      const res = await fetch(`http://localhost:7071/api/templates/new`, {
        method: 'POST',
        body: JSON.stringify(newTemplate)
      })

      if (!res.ok) {
        throw new Error('Error creating product')
      }

      const data = await res.json()
      setSuccessMessage(data.message)
    } catch (error) {
      setError('Failed to create a product. Please try again later.')
    } finally {
      setIsCreating(false)
    }
  }

  return {
    createTemplate,
    isCreating,
    error,
    successMessage
  }
}
