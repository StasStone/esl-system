import Draggable from 'react-draggable'
import 'react-resizable/css/styles.css'
import './LabelEditor.scss'
import { HiXMark } from 'react-icons/hi2'
import { useTemplate } from '../../hooks/useTemplate'
import {
  defaultTemplateItems,
  DraggableItem,
  TemplateItems
} from '../../models/draggable-item'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useSaveTemplate from '../../hooks/useSaveTemplate'

const LabelEditor = () => {
  const {
    elements,
    editedText,
    addElement,
    updateElement,
    removeElement,
    patchElements,
    editingItem,
    editItem,
    handleTextChange,
    handleSaveText
  } = useTemplate(defaultTemplateItems)
  const { templateTitle } = useParams()
  const { createTemplate } = useSaveTemplate()

  useEffect(
    function () {
      const getTemplate = async function () {
        const res = await fetch(
          `http://localhost:7071/api/templates/${templateTitle}`
        )
        const { data } = await res.json()
        const { template } = data

        if (template.items) {
          patchElements(template.items)
        }
      }

      getTemplate()
    },
    [templateTitle]
  )

  const handleSaveTemplate = () => {
    createTemplate(elements)
  }

  const isTemplateItemCreated = (type: string): boolean => {
    return !!elements[type as keyof TemplateItems]
  }

  return (
    <div className="label-editor__container">
      <div className="label-editor__toolbox">
        <h3>Toolbar</h3>
        {['Price', 'Producer', 'Discount', 'Title'].map(type => (
          <button
            disabled={isTemplateItemCreated(type)}
            key={type}
            onClick={() => addElement(type)}
          >
            Add {type}
          </button>
        ))}
      </div>
      <div className="label-editor__template">
        {Object.values(elements).map(
          (el: DraggableItem | null) =>
            el && (
              <Draggable
                key={el.type}
                position={{ x: el.x, y: el.y }}
                bounds="parent"
                onStop={(e, data) =>
                  updateElement(el.type, { ...el, x: data.x, y: data.y })
                }
              >
                <div
                  className="label-editor__draggable-item"
                  style={{ width: `${el.width}px`, height: `${el.height}px` }}
                >
                  {editingItem == el.type ? (
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
                      onClick={() => editItem(el.type, el.text)}
                    >
                      {el.text}
                    </div>
                  )}
                  <button
                    className="label-editor__item-delete"
                    onClick={e => {
                      e.stopPropagation()
                      removeElement(el.type)
                    }}
                  >
                    <HiXMark />
                  </button>
                </div>
              </Draggable>
            )
        )}
      </div>
      <button onClick={handleSaveTemplate}>Save template</button>
    </div>
  )
}

export default LabelEditor
