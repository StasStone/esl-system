import { useState } from 'react'
import {
  DraggableItem,
  getItemType,
  getItemTypeKey,
  MapTypeToSize
} from '../models/draggable-item'
import { v4 as uuidv4 } from 'uuid'

export function useTemplate(defaultElements: any[]) {
  const [elements, setElements] = useState<any>(defaultElements)

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

  return { elements, addElement, updateElement, removeElement }
}
