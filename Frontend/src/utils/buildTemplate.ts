import { DraggableItem, ItemType } from '../models/draggable-item'
import { v4 as uuidv4 } from 'uuid'

export function buildTemplate(
  width: number,
  height: number,
  x: number,
  y: number,
  text: string,
  type: ItemType
): DraggableItem {
  return {
    id: uuidv4(),
    width,
    height,
    x,
    y,
    text,
    type
  }
}
