export type Assets = Asset[]

export interface Asset {
  id: string
  name: string
  description: string
  amount: number
  status: boolean
  category: string
  imageUrl: string
}
