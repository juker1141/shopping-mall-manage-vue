<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminUserStore } from '../stores/AdminUserStore'
import { getAdminUser } from '../api/adminUserHandler'
import { AuthToken, getCookie } from '../util/cookie'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'

const router = useRouter()
const adminUserStore = useAdminUserStore()

async function getUserData() {
  try {
    const response = await getAdminUser()
    adminUserStore.updateAdminUserInfo(response)
  }
  catch (err) {
    console.error(err)
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
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
