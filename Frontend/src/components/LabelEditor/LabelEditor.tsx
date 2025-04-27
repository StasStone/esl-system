import Draggable from 'react-draggable'
import 'react-resizable/css/styles.css'
import './LabelEditor.scss'
import { HiXMark } from 'react-icons/hi2'
import { useTemplate } from '../../hooks/useTemplate'
import {
  defaultTemplateItems,
  DraggableItem
} from '../../models/draggable-item'
import { useContext, useEffect, useState } from 'react'
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
  const {
    items,
    editedText,
    addItem,
    updateItem,
    removeItem,
    patchItems,
    editingItem,
    editItem,
    editItemFont,
    handleTextChange,
    handleSaveText
  } = useTemplate(defaultTemplateItems)
  const { templateId } = useParams()
  const { createTemplate } = useSaveTemplate()
  const [templateTitle, setTemplateTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCurrent, setIsCurrent] = useState(false)

  const { user } = useContext(AuthContext)!

  useEffect(
    function () {
      const getTemplate = async function () {
        setIsLoading(true)
        try {
          const res = await fetch(
            `http://localhost:7071/api/templates/${templateId}`
          )

          if (!res.ok) {
            throw new Error('No templates')
          }

          const data = await res.json()
          console.log(data)
          const { template } = data

          if (template) {
            setTemplateTitle(template.title)
            patchItems(template.items)
            setIsCurrent(template.current)
          }
        } catch (error) {
          console.log(error)
        } finally {
          setIsLoading(false)
        }
      }
      getTemplate()
    },
    [templateId]
  )

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
        className={`${isCurrent ? 'label-editor__template-current' : 'label-editor__template'}`}
      >
        {Object.values(items).map(
          (el: DraggableItem | null) =>
            el && (
              <Draggable
                key={el.type}
                position={{ x: el.x, y: el.y }}
                bounds="parent"
                onStop={(e, data) =>
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
      {templateId !== 'new' ? (
        <Modal>
          <Modal>
            <Modal.Open opens={TEMPLATE_MODAL}>
              <button>Save template</button>
            </Modal.Open>
            <Modal.Window name={TEMPLATE_MODAL}>
              <CreateTemplateForm onCreateTemplate={handleCreateTemplate} />
            </Modal.Window>
          </Modal>
        </Modal>
      ) : (
        <button onClick={() => handleCreateTemplate(templateTitle)}>
          Create template
        </button>
      )}
    </div>
  )
}

export default LabelEditor
