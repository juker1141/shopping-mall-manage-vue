export interface ProductResponse {
  id: number
  title: string
  category: string
  price: number
  origin_price: number
  unit: string
  description: string
  content: string
  status: 1 | 0
  image_url: string
  images_url: string[]
  created_by: string
  created_at: string
}

export interface ProductForm {
  title: string
  category: string
  price: number
  origin_price: number
  unit: string
  description: string
  content: string
  status: 1 | 0
  image_file: any[]
  image_url: string
  images_url: string[]
  [key: string]: any
}

export interface GetProductsResponse {
  count: number
  data: ProductResponse[]
}
