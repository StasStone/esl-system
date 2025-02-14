import Draggable from 'react-draggable'
import 'react-resizable/css/styles.css'
import './LabelEditor.scss'
import { HiXMark } from 'react-icons/hi2'
import { useTemplate } from '../../hooks/useTemplate'
import { DraggableItem } from '../../models/draggable-item'
import { useEditTemplate } from '../../hooks/useEditTemplate'

const LabelEditor = () => {
  const { elements, addElement, updateElement, removeElement } = useTemplate([])

  const {
    editingItemId,
    editedText,
    handleEditClick,
    handleTextChange,
    handleSaveText
  } = useEditTemplate()

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
