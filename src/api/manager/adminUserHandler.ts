import type { AxiosResponse } from 'axios'
import apiHandler from '@/api/apiHandler'
import type { ApiDeleteResponse } from '@/api/types'
import type { AdminUserForm, AdminUserInfo, AdminUserResponse, GetAdminUsersResponse, LoginFormValue, LoginResponse, RenewAccessTokenResponse } from '@/api/manager/types'

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

export async function refreshAccessToken(token: string): Promise<RenewAccessTokenResponse> {
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

export async function getAdminUserInfo(): Promise<AdminUserInfo> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/manager_user/info`

  const body = {}

  const res: AxiosResponse<AdminUserInfo> = await apiHandler.Get({
    url,
    body,
  })
  return res.data
}

export async function getAdminUsers(page: number, page_size = 10): Promise<GetAdminUsersResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/manager_users`

  const body = {
    params: {
      page,
      page_size,
    },
  }

  const res: AxiosResponse<GetAdminUsersResponse> = await apiHandler.Get({
    url,
    body,
  })
  return res.data
}

export async function getAdminUser(id: string): Promise<AdminUserResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/manager_user/${id}`

  const body = {}

  const res: AxiosResponse<AdminUserResponse> = await apiHandler.Get({
    url,
    body,
  })
  return res.data
}

export async function createAdminUser(form: AdminUserForm): Promise<AdminUserResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/manager_user`

  const body = {
    ...form,
  }

  const res: AxiosResponse<AdminUserResponse> = await apiHandler.Post({
    url,
    body,
  })
  return res.data
}

export async function updateAdminUser(form: AdminUserForm, id: string): Promise<AdminUserResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/manager_user/${id}`

  const body = {
    ...form,
  }

  const res: AxiosResponse<AdminUserResponse> = await apiHandler.Patch({
    url,
    body,
  })
  return res.data
}

export async function updateAdminUserStatus(status: number, id: number): Promise<AdminUserResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/manager_user/${id}`

  const body = {
    status,
  }

  const res: AxiosResponse<AdminUserResponse> = await apiHandler.Patch({
    url,
    body,
  })
  return res.data
}

export async function deleteAdminUser(id: string): Promise<ApiDeleteResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/manager_user/${id}`

  const body = {}

  const res: AxiosResponse<ApiDeleteResponse> = await apiHandler.Delete({
    url,
    body,
  })
  return res.data
}
