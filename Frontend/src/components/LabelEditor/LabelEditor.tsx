import { useState } from 'react'
import Draggable from 'react-draggable'
import { ResizableBox } from 'react-resizable'
import { v4 as uuidv4 } from 'uuid'
import 'react-resizable/css/styles.css'
import { DraggableItem, getItemType } from '../../models/draggable-item'

const LabelEditor = () => {
  const [elements, setElements] = useState<any>([])

  const addElement = (type: string) => {
    const newElement = {
      id: uuidv4(),
      type: getItemType(type),
      x: 10,
      y: 10,
      width: 100,
      height: 50
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

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div>
        <h3>Toolbar</h3>
        {['Price', 'Producer', 'Discount', 'Title'].map(type => (
          <button key={type} onClick={() => addElement(type)}>
            Add {type}
          </button>
        ))}
      </div>
      <div
        style={{
          position: 'relative',
          width: '400px',
          height: '300px',
          border: '2px solid black',
          overflow: 'hidden'
        }}
      >
        {elements.map((el: DraggableItem) => (
          <Draggable
            key={el.id}
            position={{ x: el.x, y: el.y }}
            onStop={(e, data) =>
              updateElement(el.id, { ...el, x: data.x, y: data.y })
            }
          >
            <ResizableBox
              width={el.width}
              height={el.height}
              resizeHandles={['se']}
              onResizeStop={(e, data) => {
                updateElement(el.id, {
                  ...el,
                  width: data.size.width,
                  height: data.size.height
                })
              }}
              minConstraints={[50, 20]}
              maxConstraints={[300, 150]}
            >
              <div
                style={{
                  border: '1px solid gray',
                  padding: '10px',
                  background: 'white',
                  textAlign: 'center',
                  cursor: 'move',
                  userSelect: 'none'
                }}
              >
                {el.type}
                <button
                  style={{ position: 'absolute', top: 0, right: 0 }}
                  onClick={e => {
                    e.stopPropagation()
                    removeElement(el.id)
                  }}
                >
                  x
                </button>
              </div>
            </ResizableBox>
          </Draggable>
        ))}
      </div>
    </div>
  )
}

export default LabelEditor
