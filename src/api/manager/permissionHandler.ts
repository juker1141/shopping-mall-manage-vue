import type { AxiosResponse } from 'axios'
import apiHandler from '../apiHandler'
import type { Permission } from './types'

export async function getPermissions(page = 1, page_size = 10): Promise<Permission[]> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/admin/permissions`

  const body = {
    params: {
      page,
      page_size,
    },
  }

  const res: AxiosResponse<Permission[]> = await apiHandler.Get({ url, body })

  return res.data
}
