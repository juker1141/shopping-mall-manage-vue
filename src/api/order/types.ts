import type { ProductResponse } from '../product/types'

export interface OrderStatus {
  id: number
  name: string
  description: string
}

export interface OrderProductResponse extends ProductResponse {
  num: number
}

export interface OrderResponse {
  id: number
  full_name: string
  email: string
  shipping_address: string
  message: string
  is_paid: boolean
  total_price: number
  final_price: number
  pay_method_id: number
  status_id: number
  created_at: string
  updated_at: string
  product_list: OrderProductResponse[]
  status: OrderStatus
}

export interface GetOrdersResponse {
  count: number
  data: OrderResponse[]
}
