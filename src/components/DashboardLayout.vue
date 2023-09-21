<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Sidebar from '@/components/Sidebar.vue'
import Header from '@/components/Header.vue'
import { useAdminUserStore } from '@/stores/AdminUserStore'
import { AuthToken, getCookie } from '@/util/cookie'
import { getAdminUserInfo } from '@/api/manager/adminUserHandler'
import { getErrorMessage } from '@/api/axios'

const router = useRouter()
const adminUserStore = useAdminUserStore()

async function getUserData() {
  try {
    const response = await getAdminUserInfo()
    adminUserStore.updateAdminUserInfo(response)
  }
  catch (err: any) {
    ElMessage({
      message: `取得帳號權限資訊失敗，${getErrorMessage(err)}`,
      type: 'error',
    })
  }
}

onMounted(async () => {
  const token = getCookie(AuthToken)

  if (token)
    await getUserData()
  else
    router.push({ name: 'Login' })
})
</script>

<template>
  <div class="flex h-screen bg-gray-200 font-roboto">
    <Sidebar />

    <div class="flex-1 flex flex-col overflow-hidden">
      <Header />

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
        <div class="container mx-auto px-6 py-8">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>
