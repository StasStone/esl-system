import { useEffect, useState } from 'react'
import './ItemFontDropdown.scss'
import { ItemFont } from '../../models/draggable-item'

export default function ItemFontDropdown({
  itemType,
  font,
  onEditFont
}: {
  itemType: string
  font: ItemFont
  onEditFont: (type: string, font: ItemFont) => void
}) {
  const { fontSize: typeFontSize, fontWeight: typeFontWeight } = font
  const parsedTypeFont = parseInt(typeFontSize)
  const [fontSize, setFontSize] = useState(parsedTypeFont)
  const [fontWeight, setFontWeight] = useState(typeFontWeight)

  useEffect(
    function () {
      onEditFont(itemType, { fontSize: `${fontSize}px`, fontWeight })
    },
    [fontSize, fontWeight]
  )
  return (
    <div className="font-dropdown">
      <div className="dropdown-item">
        <label>Font Size:</label>
        <div className="input-suffix">
          <input
            type="number"
            value={fontSize}
            onChange={e => setFontSize(Number(e.target.value))}
            min="1"
          />
          <span>px</span>
        </div>
      </div>
      <div className="dropdown-item">
        <label>Font Weight:</label>
        <input
          type="number"
          value={fontWeight}
          onChange={e => {
            const value = Number(e.target.value)
            if (value % 100 === 0 && value >= 100 && value <= 900) {
              setFontWeight(value)
            }
          }}
          step="100"
          min="100"
          max="900"
        />
      </div>
    </div>
  )
}
