import { useState } from 'react'
import {
  DraggableItem,
  getItemType,
  getItemTypeKey,
  MapTypeToSize,
  TemplateItems
} from '../models/draggable-item'
import { buildTemplate } from '../utils/buildTemplate'

export function useTemplate(defaultTemplateItems: TemplateItems) {
  const [elements, setElements] = useState<TemplateItems>(defaultTemplateItems)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editedText, setEditedText] = useState<string>('')

  const addElement = (type: string) => {
    const { width, height } = MapTypeToSize[getItemTypeKey(type)]

    const newElement = buildTemplate(
      width,
      height,
      10,
      10,
      type,
      getItemType(type)
    )

    const newTemplateItems = { ...elements, [type.toLowerCase()]: newElement }

    setElements(newTemplateItems)
  }

  const updateElement = (type: string, updates: DraggableItem) => {
    const loweredType = type.toLowerCase()
    const newTemplateItems = { ...elements, [loweredType]: updates }

    setElements(newTemplateItems)
  }

  const removeElement = (type: string) => {
    const loweredType = type.toLowerCase()
    const newTemplateItems = { ...elements, [loweredType]: null }

    setElements(newTemplateItems)
  }

  const patchElements = (newElements: TemplateItems) => {
    setElements(newElements)
  }

  const editItem = (type: string, text: string) => {
    setEditingItem(type)
    setEditedText(text)
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedText(event.target.value)
  }

  const handleSaveText = (element: DraggableItem) => {
    if (editingItem) {
      updateElement(editingItem, { ...element, text: editedText })
      setEditingItem(null)
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
    editingItem
  }
}
