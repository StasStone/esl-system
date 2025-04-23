import { DraggableItem, ItemType } from '../models/draggable-item'

export function buildTemplate(
  fontSize: string,
  fontWeight: number,
  x: number,
  y: number,
  text: string,
  type: ItemType
): DraggableItem {
  return {
    fontSize,
    fontWeight,
    x,
    y,
    text,
    type
  }
}
