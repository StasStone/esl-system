import { useEffect, useState } from 'react'
import {
  defaultTemplate,
  defaultTemplateItems,
  DraggableItem,
  getItemType,
  getItemTypeKey,
  ItemFont,
  MapTypeToSize,
  Template,
  TemplateItems
} from '../models/draggable-item'
import { buildTemplate } from '../utils/buildTemplate'
import { useQuery } from '@tanstack/react-query'

type TemplateHook = {
  template: Template
  items: TemplateItems
  isLoading: boolean
  editedText: string
  addItem: (type: string) => void
  updateItem: (type: string, updates: DraggableItem) => void
  removeItem: (type: string) => void
  editItem: (type: string, text: string) => void
  editItemFont: (type: string, font: ItemFont) => void
  handleTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSaveText: (element: DraggableItem) => void
  editingItem: string | null
}

const getTemplate = async function (templateId: string): Promise<Template> {
  const res = await fetch(`http://localhost:7071/api/templates/${templateId}`, {
    method: 'GET'
  })

  if (!res.ok) {
    throw new Error('No templates')
  }

  const data = await res.json()
  const { template } = data

  if (template) return template

  return defaultTemplate
}

export function useTemplate(templateId: string | undefined): TemplateHook {
  const { isLoading, data: template } = useQuery({
    queryKey: ['templates', templateId!],
    queryFn: () => getTemplate(templateId!),
    enabled: !!templateId
  })

  useEffect(() => {
    if (template?.items) {
      setItems(template.items)
    }
  }, [templateId])

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
    template: template ? template : defaultTemplate,
    items,
    isLoading,
    editedText,
    addItem,
    updateItem,
    removeItem,
    editItem,
    editItemFont,
    handleTextChange,
    handleSaveText,
    editingItem
  }
}
