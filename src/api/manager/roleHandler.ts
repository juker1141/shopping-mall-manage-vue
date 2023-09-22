import type { AxiosResponse } from 'axios'
import apiHandler from '../apiHandler'
import type { GetRolesOptionResponse, GetRolesResponse, RoleForm, RoleResponse } from './types'

export async function getRoles(page: number, page_size = 10): Promise<GetRolesResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/roles`

  const body = {
    params: {
      page,
      page_size,
    },
  }

  const res: AxiosResponse<GetRolesResponse> = await apiHandler.Get({
    url,
    body,
  })

  return res.data
}

export async function getRole(id: string): Promise<RoleResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/role/${id}`

  const body = {}

  const res: AxiosResponse<RoleResponse> = await apiHandler.Get({
    url,
    body,
  })

  return res.data
}

export async function createRole(form: RoleForm): Promise<RoleResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/role`

  const body = {
    ...form,
  }

  const res: AxiosResponse<RoleResponse> = await apiHandler.Post({
    url,
    body,
  })

  return res.data
}

export async function updateRole(form: RoleForm, id: string): Promise<RoleResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/role/${id}`

  const body = {
    ...form,
  }

  const res: AxiosResponse<RoleResponse> = await apiHandler.Patch({
    url,
    body,
  })

  return res.data
}

export async function getRolesOption(): Promise<GetRolesOptionResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/roles/option`

  const body = {}

  const res: AxiosResponse<GetRolesOptionResponse> = await apiHandler.Get({
    url,
    body,
  })

  return res.data
}
