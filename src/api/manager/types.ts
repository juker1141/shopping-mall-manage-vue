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
  role_id: number
}

export interface Role {
  id: number
  name: string
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

export interface AdminUserResponse extends AdminUser {
  role: Role
}

export interface AdminUserInfo {
  id: number
  account: string
  full_name: string
  status: 0 | 1
  password_changed_at: string
  created_at: string
  permission_list: Permission[]
}

export interface RenewAccessTokenResponse {
  access_token: string
  access_token_expires_at: string
}

export interface RoleResponse extends Role {
  permission_list: Permission[]
}

export interface GetRolesResponse {
  count: number
  data: RoleResponse[]
}

export interface GetRolesOptionResponse {
  roles: Role[]
}

export interface RoleForm {
  name: string
  permissions_id: number[]
}

export interface AdminUserForm {
  account: string
  full_name: string
  status: 0 | 1
  role_id: number
  password?: string
  confirmPassword?: string
  old_password?: string
  new_password?: string
}

export interface GetAdminUsersResponse {
  count: number
  data: AdminUserResponse[]
}
