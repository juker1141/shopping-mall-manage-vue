import type { AxiosResponse } from 'axios'
import apiHandler from '@/api/apiHandler'
import type { ApiDeleteResponse } from '@/api/types'
import type { CouponForm, CouponResponse, GetCouponsResponse } from '@/api/coupon/types'

export async function getCoupons(page: number, page_size = 10): Promise<GetCouponsResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/admin/coupons`

  const body = {
    params: {
      page,
      page_size,
    },
  }

  const res: AxiosResponse<GetCouponsResponse> = await apiHandler.Get({
    url,
    body,
  })
  return res.data
}

export async function getCoupon(id: string): Promise<CouponResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/admin/coupon/${id}`

  const body = {}

  const res: AxiosResponse<CouponResponse> = await apiHandler.Get({
    url,
    body,
  })
  return res.data
}

export async function createCoupon(form: CouponForm): Promise<CouponResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/admin/coupon`
  console.log(form)

  const body = {
    ...form,
  }

  if (body.start_at === '')
    delete body.start_at

  if (body.expires_at === '')
    delete body.expires_at

  console.log(body)

  const res: AxiosResponse<CouponResponse> = await apiHandler.Post({
    url,
    body,
  })
  return res.data
}

export async function updateCoupon(form: CouponForm, id: string): Promise<CouponResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/admin/coupon/${id}`

  const body = {
    ...form,
  }

  const res: AxiosResponse<CouponResponse> = await apiHandler.Patch({
    url,
    body,
  })
  return res.data
}

export async function deleteCoupon(id: string): Promise<ApiDeleteResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/admin/coupon/${id}`

  const body = {}

  const res: AxiosResponse<ApiDeleteResponse> = await apiHandler.Delete({
    url,
    body,
  })
  return res.data
}
