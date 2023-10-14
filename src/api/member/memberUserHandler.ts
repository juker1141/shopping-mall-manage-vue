import type { AxiosResponse } from 'axios'
import apiHandler from '@/api/apiHandler'
import type { ApiDeleteResponse } from '@/api/types'
import type { GetMemberUsersResponse, MemberUserResponse, MemberUserForm } from '@/api/member/types'


export async function getMemberUsers(page: number, page_size = 10): Promise<GetMemberUsersResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/member_users`

  const body = {
    params: {
      page,
      page_size,
    },
  }

  const res: AxiosResponse<GetMemberUsersResponse> = await apiHandler.Get({
    url,
    body,
  })
  return res.data
}

export async function getMemberUser(id: string): Promise<MemberUserResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/member_user/${id}`

  const body = {}

  const res: AxiosResponse<MemberUserResponse> = await apiHandler.Get({
    url,
    body,
  })
  return res.data
}

export async function updateMemberUser(form: MemberUserForm, id: string): Promise<MemberUserResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/member_user/${id}`

  const body = {
    ...form,
  }

  const res: AxiosResponse<MemberUserResponse> = await apiHandler.FormPatch({
    url,
    body,
  })
  return res.data
}

export async function updateMemberUserStatus(status: number, id: number): Promise<MemberUserResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/member_user/${id}`

  const body = {
    status,
  }

  const res: AxiosResponse<MemberUserResponse> = await apiHandler.Patch({
    url,
    body,
  })
  return res.data
}

export async function deleteMemberUser(id: string): Promise<ApiDeleteResponse> {
  const url = `${import.meta.env.VITE_BACKEND_HOST}/member_user/${id}`

  const body = {}

  const res: AxiosResponse<ApiDeleteResponse> = await apiHandler.Delete({
    url,
    body,
  })
  return res.data
}
