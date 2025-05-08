import './LabelEditorToolbox.scss'
import ItemFontDropdown from '../ItemFontDropdown/ItemFontDropdown'
import getItemFontByType from '../../utils/getItemFontByType'
import { ItemFont, TemplateItems } from '../../models/draggable-item'
import { useState } from 'react'
import { HiChevronDown } from 'react-icons/hi2'

export default function LabelEditorToolbox({
  templateItems,
  onAddItem,
  onEditItemFont
}: {
  templateItems: TemplateItems
  onAddItem: (type: string) => void
  onEditItemFont: (type: string, font: ItemFont) => void
}) {
  const [openDropdownType, setOpenDropdownType] = useState<string | null>(null)

  const isTemplateItemCreated = (type: string): boolean => {
    return !!templateItems[type as keyof TemplateItems]
  }

  const openDropdown = (type: string): void => {
    setOpenDropdownType(prev => (prev === type ? null : type))
  }

  return (
    <div className="label-editor__toolbox">
      <h3>Toolbar</h3>
      {['Price', 'Producer', 'Discount', 'Name'].map(type => {
        const lowerCasedType = type.toLowerCase()
        return isTemplateItemCreated(lowerCasedType) ? (
          <div key={type} className="label-editor__tool-wrapper">
            <div
              className="label-editor__tool"
              onClick={() => openDropdown(type)}
            >
              {type} <HiChevronDown />
            </div>
            {openDropdownType === type && (
              <div className="label-editor__dropdown">
                <ItemFontDropdown
                  itemType={lowerCasedType}
                  font={getItemFontByType(lowerCasedType, templateItems)}
                  onEditFont={onEditItemFont}
                />
              </div>
            )}
          </div>
        ) : (
          <button
            disabled={isTemplateItemCreated(lowerCasedType)}
            key={type}
            onClick={() => onAddItem(type)}
          >
            Add {type}
          </button>
        )
      })}
    </div>
  )
}
