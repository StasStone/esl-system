import { Product } from '../models/product'

export const mockedData: Product[] = [
  {
    price: '22',
    name: 'Eggs',
    producer: 'Producer1',
    id: '1234-fp-45',
    inventoryCount: 200,
    sku: '1234-sku-45',
    labels: ['label1', 'label2']
  },
  {
    price: '34',
    name: 'Tomatoes',
    producer: 'Producer2',
    id: '1468-pr-65',
    inventoryCount: 200,
    sku: '1468-sku-65',
    labels: ['label3', 'label4']
  },
  {
    price: '17',
    name: 'Onion',
    producer: 'Producer1',
    id: '5431-gh-98',
    inventoryCount: 200,
    sku: '5431-sku-98',
    labels: ['label5', 'label6']
  },
  {
    price: '56',
    name: 'Beef',
    producer: 'Producer3',
    id: '6920-wr-66',
    inventoryCount: 200,
    sku: '6920-sku-66',
    labels: ['label7', 'label8']
  }
]
