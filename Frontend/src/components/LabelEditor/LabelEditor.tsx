import Draggable from 'react-draggable'
import 'react-resizable/css/styles.css'
import './LabelEditor.scss'
import { HiXMark } from 'react-icons/hi2'
import { useTemplate } from '../../hooks/useTemplate'
import { DraggableItem } from '../../models/draggable-item'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const LabelEditor = () => {
  const {
    elements,
    editedText,
    addElement,
    updateElement,
    removeElement,
    patchElements,
    editingItemId,
    editItem,
    handleTextChange,
    handleSaveText
  } = useTemplate([])
  const { templateTitle } = useParams()

  useEffect(
    function () {
      const getTemplate = async function () {
        const res = await fetch(
          `http://localhost:3000/esl-system/v1/templates/${templateTitle}`
        )
        const { data } = await res.json()
        const { template } = data

        if (template.elements.length > 0) {
          patchElements(template.elements)
        }
      }

      getTemplate()
    },
    [templateTitle]
  )

  const handleSaveTemplate = () => {}

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
                  onClick={() => editItem(el.id, el.text)}
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
      <button onClick={handleSaveTemplate}>Save template</button>
    </div>
  )
}

export default LabelEditor
