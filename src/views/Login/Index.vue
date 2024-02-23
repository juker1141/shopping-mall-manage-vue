<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { LoginFormValue } from '../../api/manager/types'
import { loginAdminUser } from '../../api/manager/adminUserHandler'
import { AuthToken, RefreshToken, RememberAccount, getCookie, removeCookie, removeLoginCookies, setCookie } from '../../util/cookie/index'

const router = useRouter()
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

async function login() {
  if (isNeedRember.value)
    setCookie(RememberAccount, formValue.value.account)
  else
    removeCookie(RememberAccount)

  try {
    const response = await loginAdminUser(formValue.value)

    removeLoginCookies([AuthToken, RefreshToken])

    setCookie(AuthToken, response.access_token)
    setCookie(RefreshToken, response.refresh_token)
    router.push('/home')
  }
  catch (err: any) {
    console.log(err)
  }
}
</script>

<template>
  <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <fontAwesomeIcon :icon="['fas', 'store']" size="2xl" class="text-primary" />
        <span class="text-2xl font-semibold text-gray-700 ml-2">Shopping Mall</span>
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
</template>
