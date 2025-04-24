import { useState } from 'react'
import {
  DraggableItem,
  getItemType,
  getItemTypeKey,
  ItemFont,
  MapTypeToSize,
  TemplateItems
} from '../models/draggable-item'
import { buildTemplate } from '../utils/buildTemplate'

export function useTemplate(defaultTemplateItems: TemplateItems) {
  const [items, setItems] = useState<TemplateItems>(defaultTemplateItems)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editedText, setEditedText] = useState<string>('')

  const addItem = (type: string) => {
    const { fontSize, fontWeight } = MapTypeToSize[getItemTypeKey(type)]

    const newElement = buildTemplate(
      fontSize,
      fontWeight,
      10,
      10,
      type,
      getItemType(type)
    )

    const newTemplateItems = { ...items, [type.toLowerCase()]: newElement }

    setItems(newTemplateItems)
  }

  const updateItem = (type: string, updates: DraggableItem) => {
    const loweredType = type.toLowerCase()
    const newTemplateItems = { ...items, [loweredType]: updates }

    setItems(newTemplateItems)
  }

  const removeItem = (type: string) => {
    const loweredType = type.toLowerCase()
    const newTemplateItems = { ...items, [loweredType]: null }

    setItems(newTemplateItems)
  }

  const patchItems = (newitems: TemplateItems) => {
    setItems(newitems)
  }

  const editItem = (type: string, text: string) => {
    setEditingItem(type)
    setEditedText(text)
  }

  const editItemFont = (type: string, font: ItemFont) => {
    const loweredType = type.toLowerCase()
    const updatedItem = {
      ...items[loweredType as keyof TemplateItems],
      ...font
    }
    const newTemplateItems = { ...items, [loweredType]: updatedItem }
    setItems(newTemplateItems)
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedText(event.target.value)
  }

  const handleSaveText = (element: DraggableItem) => {
    if (editingItem) {
      updateItem(editingItem, { ...element, text: editedText })
      setEditingItem(null)
    }
  }

  return {
    items,
    editedText,
    addItem,
    updateItem,
    removeItem,
    patchItems,
    editItem,
    editItemFont,
    handleTextChange,
    handleSaveText,
    editingItem
  }
}
