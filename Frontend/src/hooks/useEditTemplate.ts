import { useState } from 'react'
import { DraggableItem } from '../models/draggable-item'
import { useTemplate } from './useTemplate'

export function useEditTemplate() {
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editedText, setEditedText] = useState<string>('')

  const { updateElement } = useTemplate([])

  const handleEditClick = (id: string, text: string) => {
    setEditingItemId(id)
    setEditedText(text)
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedText(event.target.value)
  }

  const handleSaveText = (element: DraggableItem) => {
    if (editingItemId) {
      updateElement(editingItemId, { ...element, text: editedText })
      setEditingItemId(null)
    }
  }

  return {
    editingItemId,
    editedText,
    handleEditClick,
    handleTextChange,
    handleSaveText
  }
}
