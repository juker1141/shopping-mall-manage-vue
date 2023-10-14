export interface MemberUserResponse {
  id: number
  account: string
  email: string
  full_name: string
  gender_id: number
  cellphone: string
  hashed_password: string
  address: string
  shipping_address: string
  post_code: string
  status: 0 | 1
  avatar_url: string
  password_changed_at: string
  created_at: string
}


export interface MemberUserForm {
  full_name: string
  cellphone: string
  address: string
  shipping_address: string
  post_code: string
  status: 0 | 1
  old_password?: string
  new_password?: string
  avatar_file: File
}

export interface GetMemberUsersResponse {
  count: number
  data: MemberUserResponse[]
}