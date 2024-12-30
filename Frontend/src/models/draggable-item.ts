export type DraggableItem = {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: ItemType
}

export enum ItemType {
  Price = 'Price',
  Producer = 'Producer',
  Discount = 'Discount',
  Title = 'Title'
}

export const getItemTypeKey = (key: string) => {
  return key as keyof typeof ItemType
}

export const getItemType = (key: string) => {
  return ItemType[getItemTypeKey(key)]
}
