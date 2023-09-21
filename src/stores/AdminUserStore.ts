import { defineStore } from 'pinia'
import type { AdminUser, AdminUserInfoResponse, Permission } from '../api/manager/adminUserHandler'

export interface AdminUserInfo {
  adminUser: AdminUser
  permissionList: Permission[]
}

export const useAdminUserStore = defineStore('AdminUserStore', {
  state: (): AdminUserInfo => {
    return {
      adminUser: {
        id: 0,
        account: '',
        full_name: '',
        status: 0,
        password_changed_at: '',
        created_at: '',
      },
      permissionList: [],
    }
  },

  actions: {
    updateAdminUserInfo({ admin_user, permission_list }: AdminUserInfoResponse) {
      this.adminUser = admin_user
      this.permissionList = permission_list
    },
  },

  // getter
})
