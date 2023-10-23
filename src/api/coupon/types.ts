export interface CouponResponse {
  id: number
  title: string
  code: string
  percent: number
  created_by: string
  start_at: string
  expires_at: string
  created_at: string
}

export interface CouponForm {
  title: string
  code: string
  percent: number
  start_at?: string
  expires_at?: string
}

export interface GetCouponsResponse {
  count: number
  data: CouponResponse[]
}
