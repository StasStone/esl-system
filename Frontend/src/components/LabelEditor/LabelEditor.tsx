import { useState } from 'react'
import Draggable from 'react-draggable'
import { v4 as uuidv4 } from 'uuid'
import 'react-resizable/css/styles.css'
import {
  DraggableItem,
  getItemType,
  getItemTypeKey,
  MapTypeToSize
} from '../../models/draggable-item'

import './LabelEditor.scss'
import { HiXMark } from 'react-icons/hi2'

const LabelEditor = () => {
  const [elements, setElements] = useState<any>([])
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

  return (
    <div className="label-editor__container">
      <div className="label-editor__toolbox">
        <h3>Toolbar</h3>
        {['Price', 'Producer', 'Discount', 'Title'].map(type => (
          <button key={type} onClick={() => addElement(type)}>
            Add {type}
          </button>
        ))}
      </div>
      <div className="label-editor__template">
        {elements.map((el: DraggableItem) => (
          <Draggable
            key={el.id}
            position={{ x: el.x, y: el.y }}
            bounds="parent"
            onStop={(e, data) =>
              updateElement(el.id, { ...el, x: data.x, y: data.y })
            }
          >
            <div
              className="label-editor__draggable-item"
              style={{ width: `${el.width}px`, height: `${el.height}px` }}
            >
              {editingItemId === el.id ? (
                <div>
                  <input
                    type="text"
                    value={editedText}
                    onChange={handleTextChange}
                    onBlur={() => handleSaveText(el)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleSaveText(el)
                      }
                    }}
                    autoFocus
                  />
                </div>
              ) : (
                <div
                  className="label-editor__item-text"
                  onClick={() => handleEditClick(el.id, el.text)}
                >
                  {el.text}
                </div>
              )}
              <button
                className="label-editor__item-delete"
                onClick={e => {
                  e.stopPropagation()
                  removeElement(el.id)
                }}
              >
                <HiXMark />
              </button>
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  )
}

export default LabelEditor
