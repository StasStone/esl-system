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
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useSaveTemplate from '../../hooks/useSaveTemplate'
import AuthContext from '../../pages/AuthProvider'
import Loader from '../Loader/Loader'
import './LabelEditor.scss'

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
  const { templateId } = useParams()
  const { createTemplate } = useSaveTemplate()
  const [isLoading, setIsLoading] = useState(false)
  const [isCurrent, setIsCurrent] = useState(false)

  const { user } = useContext(AuthContext)!

  useEffect(
    function () {
      const getTemplate = async function () {
        setIsLoading(true)
        const res = await fetch(
          `http://localhost:7071/api/templates/${templateId}`
        )
        const data = await res.json()
        console.log(data)
        const { template } = data

        if (template.items) {
          patchElements(template.items)
        }

        setIsCurrent(template.current)
        setIsLoading(false)
      }

      getTemplate()
    },
    [templateId]
  )

  const handleSaveTemplate = () => {
    const { store_id } = user!
    createTemplate(elements, store_id)
  }

  const isTemplateItemCreated = (type: string): boolean => {
    return !!elements[type as keyof TemplateItems]
  }

  if (isLoading) return <Loader width="1rem" height="1rem" />

  return (
    <div className="label-editor__container">
      <div className="label-editor__toolbox">
        <h3>Toolbar</h3>
        {['Price', 'Producer', 'Discount', 'Title'].map(type => (
          <button
            disabled={isTemplateItemCreated(type.toLowerCase())}
            key={type}
            onClick={() => addElement(type)}
          >
            Add {type}
          </button>
        ))}
      </div>
      <div
        className={`${isCurrent ? 'label-editor__template-current' : 'label-editor__template'}`}
      >
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
