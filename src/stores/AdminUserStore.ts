import { defineStore } from 'pinia'
import type { AdminUserInfo, Permission } from '@/api/manager/types'

export const useAdminUserStore = defineStore('AdminUserStore', {
  state: (): AdminUserInfo => {
    return {
      id: 0,
      account: '',
      full_name: '',
      status: 0,
      password_changed_at: '',
      created_at: '',
      permission_list: [] as Permission[],
    }
  },

  actions: {
    updateAdminUserInfo(info: AdminUserInfo) {
      this.$state = info
    },
  },

  // getter
})
