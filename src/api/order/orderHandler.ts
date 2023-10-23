import type { AxiosResponse } from 'axios'
import apiHandler from '@/api/apiHandler'
import type { GetOrdersResponse, OrderResponse } from '@/api/order/types'

export async function getOrders(page: number, page_size = 10): Promise<GetOrdersResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/admin/orders`

  const body = {
    params: {
      page,
      page_size,
    },
  }

  const res: AxiosResponse<GetOrdersResponse> = await apiHandler.Get({
    url,
    body,
  })
  return res.data
}

export async function getOrder(id: string): Promise<OrderResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/admin/order/${id}`

  const body = {}

  const res: AxiosResponse<OrderResponse> = await apiHandler.Get({
    url,
    body,
  })
  return res.data
}

export async function updateOrder(status_id: number, id: string): Promise<OrderResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/admin/order/${id}`

  const body = {
    status_id,
  }

  const res: AxiosResponse<OrderResponse> = await apiHandler.Patch({
    url,
    body,
  })
  return res.data
}
