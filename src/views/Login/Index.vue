<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginAdminUserHandler } from '../../api/adminUserHandler'
import { AuthToken, RefreshToken, RememberAccount, getCookie, removeCookie, setCookie } from '../../util/cookie/index'

const router = useRouter()
export interface LoginFormValue {
  account: string
  password: string
}
const formValue = ref<LoginFormValue>({
  account: 'test0001',
  password: 'test0001',
})
const isNeedRember = ref(false)

onMounted(() => {
  const remeberAccount = getCookie(RememberAccount)
  if (remeberAccount)
    formValue.value.account = remeberAccount
})

interface AdminUser {
  id: number
  account: string
  full_name: string
  status: 0 | 1
  password_changed_at: string
  created_at: string
}

interface Permission {
  id: number
  name: string
  created_at: string
}

interface LoginResult {
  session_id: string
  access_token: string
  access_token_expires_at: string
  refresh_token: string
  refresh_token_expires_at: string
  admin_user: AdminUser
  permission_list: Permission[]
}

async function login() {
  if (isNeedRember.value)
    setCookie(RememberAccount, formValue.value.account)
  else
    removeCookie(RememberAccount)

  try {
    const result: LoginResult = await loginAdminUserHandler(formValue.value)
    if (getCookie(AuthToken))
      removeCookie(AuthToken)
    if (getCookie(RefreshToken))
      removeCookie(RefreshToken)

    setCookie(AuthToken, result.access_token)
    setCookie(RefreshToken, result.refresh_token)
    console.log(result)
  // router.push('/dashboard')
  }
  catch (err: any) {

  }
}
</script>

<template>
  <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <svg
          class="w-10 h-10"
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M364.61 390.213C304.625 450.196 207.37 450.196 147.386 390.213C117.394 360.22 102.398 320.911 102.398 281.6C102.398 242.291 117.394 202.981 147.386 172.989C147.386 230.4 153.6 281.6 230.4 307.2C230.4 256 256 102.4 294.4 76.7999C320 128 334.618 142.997 364.608 172.989C394.601 202.981 409.597 242.291 409.597 281.6C409.597 320.911 394.601 360.22 364.61 390.213Z"
            fill="#4C51BF"
            stroke="#4C51BF"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M201.694 387.105C231.686 417.098 280.312 417.098 310.305 387.105C325.301 372.109 332.8 352.456 332.8 332.8C332.8 313.144 325.301 293.491 310.305 278.495C295.309 263.498 288 256 275.2 230.4C256 243.2 243.201 320 243.201 345.6C201.694 345.6 179.2 332.8 179.2 332.8C179.2 352.456 186.698 372.109 201.694 387.105Z"
            fill="white"
          />
        </svg>
        <span class="text-2xl font-semibold text-gray-700">V-Dashboard</span>
      </div>

      <form class="mt-4" @submit.prevent="login">
        <label class="block">
          <span class="text-sm text-gray-700">Account</span>
          <input
            v-model="formValue.account"
            type="text"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          >
        </label>

        <label class="block mt-3">
          <span class="text-sm text-gray-700">Password</span>
          <input
            v-model="formValue.password"
            type="password"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          >
        </label>

        <div class="flex items-center justify-between mt-4">
          <div>
            <label class="inline-flex items-center">
              <input v-model="isNeedRember" type="checkbox" class="text-indigo-600 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
              <span class="mx-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          <div>
            <a
              class="block text-sm text-indigo-700 fontme hover:underline"
              href="#"
            >Forgot your password?</a>
          </div>
        </div>

        <div class="mt-6">
          <button
            type="submit"
            class="w-full px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>../util/cookie/cookie
../api/adminUserHandler
