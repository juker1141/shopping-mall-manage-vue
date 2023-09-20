import type { AxiosResponse } from 'axios'
import apiHandler from './apiHandler'

export interface LoginFormValue {
  account: string
  password: string
}

export interface AdminUser {
  id: number
  account: string
  full_name: string
  status: 0 | 1
  password_changed_at: string
  created_at: string
}

export interface Permission {
  id: number
  name: string
  created_at: string
}

export interface LoginResponse {
  session_id: string
  access_token: string
  access_token_expires_at: string
  refresh_token: string
  refresh_token_expires_at: string
  admin_user: AdminUser
  permission_list: Permission[]
}

export interface AdminUserInfoResponse {
  admin_user: AdminUser
  permission_list: Permission[]
}

export async function loginAdminUser({ account, password }: LoginFormValue): Promise<LoginResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/login`

  const body = {
    account,
    password,
  }

  const res: AxiosResponse<LoginResponse> = await apiHandler.NoAuthPost({
    url,
    body,
  })
  return res.data
}

export async function getAdminUser(): Promise<AdminUserInfoResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/manager-user`

  const body = {}

  const res: AxiosResponse<AdminUserInfoResponse> = await apiHandler.Get({
    url,
    body,
  })
  return res.data
}
