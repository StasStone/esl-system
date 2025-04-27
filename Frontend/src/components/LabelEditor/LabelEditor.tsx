import Draggable from 'react-draggable'
import 'react-resizable/css/styles.css'
import './LabelEditor.scss'
import { HiXMark } from 'react-icons/hi2'
import { useTemplate } from '../../hooks/useTemplate'
import { DraggableItem } from '../../models/draggable-item'
import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import useSaveTemplate from '../../hooks/useSaveTemplate'
import AuthContext from '../../pages/AuthProvider'
import Loader from '../Loader/Loader'
import './LabelEditor.scss'
import '../LabelEditorToolbox/LabelEditorToolbox'
import Modal from '../Modal/Modal'
import { TEMPLATE_MODAL } from '../../utils/constants'
import CreateTemplateForm from '../CreateTemplateForm/CreateTemplateForm'
import LabelEditorToolbox from '../LabelEditorToolbox/LabelEditorToolbox'

const LabelEditor = () => {
  const { templateId } = useParams()
  const { user } = useContext(AuthContext)!

  const {
    template,
    items,
    isLoading,
    editedText,
    addItem,
    updateItem,
    removeItem,
    editingItem,
    editItem,
    editItemFont,
    handleTextChange,
    handleSaveText
  } = useTemplate(templateId)

  const { title, current } = template
  const { createTemplate } = useSaveTemplate()

  const handleCreateTemplate = (title: string) => {
    const { store_id } = user!
    createTemplate(items, store_id, title)
  }

  if (isLoading) return <Loader width="1rem" height="1rem" />

  return (
    <div className="label-editor__container">
      <LabelEditorToolbox
        onAddItem={addItem}
        onEditItemFont={editItemFont}
        templateItems={items}
      />
      <div
        className={`${current ? 'label-editor__template-current' : 'label-editor__template'}`}
      >
        {Object.values(items).map(
          (el: DraggableItem | null) =>
            el && (
              <Draggable
                key={el.type}
                position={{ x: el.x, y: el.y }}
                bounds="parent"
                onStop={(_e, data) =>
                  updateItem(el.type, { ...el, x: data.x, y: data.y })
                }
              >
                <div className="label-editor__draggable-item">
                  {editingItem == el.type ? (
                    <div className="label-editor__draggable-item-edited">
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
                      style={{
                        fontSize: el.fontSize,
                        fontWeight: el.fontWeight
                      }}
                      onClick={() => editItem(el.type, el.text)}
                    >
                      {el.text}
                    </div>
                  )}
                  <button
                    className="label-editor__item-delete"
                    onClick={e => {
                      e.stopPropagation()
                      removeItem(el.type)
                    }}
                  >
                    <HiXMark />
                  </button>
                </div>
              </Draggable>
            )
        )}
      </div>
      {templateId === 'new' ? (
        <Modal>
          <Modal>
            <Modal.Open opens={TEMPLATE_MODAL}>
              <button>Create template</button>
            </Modal.Open>
            <Modal.Window name={TEMPLATE_MODAL}>
              <CreateTemplateForm onCreateTemplate={handleCreateTemplate} />
            </Modal.Window>
          </Modal>
        </Modal>
      ) : (
        <button onClick={() => handleCreateTemplate(title)}>
          Save template
        </button>
      )}
    </div>
  )
}

export default LabelEditor
