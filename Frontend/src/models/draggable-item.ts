export type DraggableItem = {
  x: number
  y: number
  width: number
  height: number
  type: ItemType
  text: string
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

type TypeToSize = {
  [key in ItemType]: { width: number; height: number }
}

export const MapTypeToSize: TypeToSize = {
  Price: { width: 120, height: 40 },
  Producer: { width: 150, height: 50 },
  Discount: { width: 100, height: 30 },
  Title: { width: 200, height: 60 }
}

export type Template = {
  template_id: string
  items: TemplateItems
}

export type TemplateItems = {
  name: DraggableItem | null
  price: DraggableItem | null
  discount: DraggableItem | null
  producer: DraggableItem | null
}

export const defaultTemplateItems: TemplateItems = {
  name: null,
  price: null,
  discount: null,
  producer: null
}
