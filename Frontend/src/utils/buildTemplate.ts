import { DraggableItem, ItemType } from '../models/draggable-item'

export function buildTemplate(
  width: number,
  height: number,
  x: number,
  y: number,
  text: string,
  type: ItemType
): DraggableItem {
  return {
    width,
    height,
    x,
    y,
    text,
    type
  }
}
