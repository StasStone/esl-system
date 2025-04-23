import { ItemFont, TemplateItems } from '../models/draggable-item'

export default function getItemFontByType(
  type: string,
  items: TemplateItems
): ItemFont {
  const item = items[type as keyof TemplateItems]!

  return { fontSize: item.fontSize, fontWeight: item.fontWeight }
}
