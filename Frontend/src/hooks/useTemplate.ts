import { useState } from 'react'
import {
  DraggableItem,
  getItemType,
  getItemTypeKey,
  MapTypeToSize
} from '../models/draggable-item'
import { v4 as uuidv4 } from 'uuid'

export function useTemplate(defaultElements: DraggableItem[]) {
  const [elements, setElements] = useState<DraggableItem[]>(defaultElements)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editedText, setEditedText] = useState<string>('')

  const addElement = (type: string) => {
    const { width, height } = MapTypeToSize[getItemTypeKey(type)]

    const newElement = {
      id: uuidv4(),
      type: getItemType(type),
      text: type,
      x: 10,
      y: 10,
      width,
      height
    }
    setElements([...elements, newElement])
  }

  const updateElement = (id: string, updates: DraggableItem) => {
    setElements(
      elements.map((el: DraggableItem) =>
        el.id === id ? { ...el, ...updates } : el
      )
    )
  }

  const removeElement = (id: string) => {
    setElements(elements.filter((el: DraggableItem) => el.id !== id))
  }

  const patchElements = (newElements: DraggableItem[]) => {
    setElements(newElements)
  }

  const editItem = (id: string, text: string) => {
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
    elements,
    editedText,
    addElement,
    updateElement,
    removeElement,
    patchElements,
    editItem,
    handleTextChange,
    handleSaveText,
    editingItemId
  }
}
