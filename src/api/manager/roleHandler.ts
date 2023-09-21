import type { AxiosResponse } from 'axios'
import apiHandler from '../apiHandler'
import type { GetRolesResponse } from './types'

export async function getRoles(page: number, pageSize = 10): Promise<GetRolesResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/roles`

  const body = {
    params: {
      page,
      page_size: pageSize,
    },
  }

  const res: AxiosResponse<GetRolesResponse> = await apiHandler.Get({
    url,
    body,
  })

  return res.data
}
