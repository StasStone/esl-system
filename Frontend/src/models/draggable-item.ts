export type DraggableItem = {
  x: number
  y: number
  fontSize: string
  fontWeight: number
  type: ItemType
  text: string
}

export enum ItemType {
  Price = 'Price',
  Producer = 'Producer',
  Discount = 'Discount',
  Name = 'Name'
}

export const getItemTypeKey = (key: string) => {
  return key as keyof typeof ItemType
}

export const getItemType = (key: string) => {
  return ItemType[getItemTypeKey(key)]
}

export type ItemFont = {
  fontSize: string
  fontWeight: number
}

type TypeToFont = {
  [key in ItemType]: ItemFont
}

export const MapTypeToSize: TypeToFont = {
  Price: { fontSize: '60px', fontWeight: 400 },
  Producer: { fontSize: '40px', fontWeight: 200 },
  Discount: { fontSize: '20px', fontWeight: 300 },
  Name: { fontSize: '60px', fontWeight: 4000 }
}

export type Template = {
  id: string
  title: string
  store_id: string
  items: TemplateItems
  current: boolean
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
