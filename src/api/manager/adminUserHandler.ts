import type { AxiosResponse } from 'axios'
import apiHandler from '../apiHandler'
import type { AdminUserInfoResponse, LoginFormValue, LoginResponse, RenewAccessTokenResponse } from './types'

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

export async function renewAccessToken(token: string): Promise<RenewAccessTokenResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/tokens/renew_access`

  const body = {
    refresh_token: token,
  }

  const res: AxiosResponse<RenewAccessTokenResponse> = await apiHandler.Post({
    url,
    body,
  })
  return res.data
}

export async function getAdminUserInfo(): Promise<AdminUserInfoResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/manager-user`

  const body = {}

  const res: AxiosResponse<AdminUserInfoResponse> = await apiHandler.Get({
    url,
    body,
  })
  return res.data
}
