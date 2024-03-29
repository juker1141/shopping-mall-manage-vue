<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSidebar } from '../composables/useSidebar'
import { useAdminUserStore } from '../stores/AdminUserStore'

import { AuthToken, RefreshToken, removeLoginCookies } from '../util/cookie'

import { sideBarData } from '../util/sideBarData'

const route = useRoute()
const router = useRouter()
const adminUserInfo = storeToRefs(useAdminUserStore())

const { isOpen } = useSidebar()
const isShowAccountList = ref(false)

const activeClass = ref(
  'bg-gray-600 bg-opacity-25 text-gray-100 border-gray-100',
)
const inactiveClass = ref(
  'border-gray-900 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100',
)

const routePath = computed(() => route.path || '')

watch(routePath, () => {
  if (routePath.value.includes('/manager') || routePath.value.includes('/manager'))
    isShowAccountList.value = true
})

function findCommonObjects(a: typeof sideBarData, b: typeof adminUserInfo.permission_list.value) {
  const result = []

  for (const objA of a) {
    const commonObj = b.find(objB => objB.name === objA.title)
    if (commonObj)
      result.push(objA)
  }

  return result
}

const sideBarList = computed(() => findCommonObjects(sideBarData, adminUserInfo.permission_list.value))

function logout() {
  removeLoginCookies([AuthToken, RefreshToken])
  router.push({ name: 'Login' })
}
</script>

<script lang="ts">
export default {
  name: 'SidebarComponent',
}
</script>

<template>
  <div class="flex">
    <!-- Backdrop -->
    <div
      :class="isOpen ? 'block' : 'hidden'"
      class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"
      @click="isOpen = false"
    />
    <!-- End Backdrop -->

    <div
      :class="isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
      class="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0 h-full flex flex-col"
    >
      <div class="flex items-center justify-center mt-8">
        <router-link to="/home">
          <div class="flex items-center">
            <fontAwesomeIcon :icon="['fas', 'store']" size="xl" class="text-white" />
            <span class="mx-2 text-2xl font-semibold text-white">Shopping Mall</span>
          </div>
        </router-link>
      </div>

      <nav class="mt-10 grow pb-16">
        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[routePath.includes('home') ? activeClass : inactiveClass]"
          to="/home"
        >
          <div class="w-5 h-5 flex justify-center items-center">
            <FontAwesomeIcon :icon="['fas', 'house']" size="lg" />
          </div>
          <span class="mx-4">首頁</span>
        </router-link>
        <template v-for="data in sideBarList" :key="data.path">
          <router-link
            v-if="data.style === 'default'"
            class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
            :class="[routePath.includes(data.path) ? activeClass : inactiveClass]"
            :to="data.path"
          >
            <div class="w-5 h-5 flex justify-center items-center">
              <FontAwesomeIcon :icon="data.icon" size="lg" />
            </div>
            <span class="mx-4">{{ data.title }}</span>
          </router-link>

          <div v-else class="relative">
            <a
              href="#"
              class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4 relative"
              :class="[inactiveClass]"
              @click.prevent="isShowAccountList = !isShowAccountList"
            >
              <div class="w-5 h-5 flex justify-center items-center">
                <FontAwesomeIcon :icon="data.icon" size="lg" />
              </div>
              <span class="mx-4 grow">{{ data.title }}</span>

              <FontAwesomeIcon :icon="['fas', 'chevron-up']" class="justify-items-end transition-transform duration-300 ease-in-out" :class="[isShowAccountList ? 'rotate-180' : 'rotate-0']" />
            </a>
            <ul class="transition-[height] overflow-hidden duration-300 ease-in-out" :class="[isShowAccountList ? 'h-28' : 'h-0']">
              <li v-for="childData in data.child" :key="childData.path">
                <router-link
                  class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
                  :class="[routePath.includes(childData.path) ? activeClass : inactiveClass]"
                  :to="childData.path"
                >
                  <span class="mx-10">{{ childData.title }}</span>
                </router-link>
              </li>
            </ul>
          </div>
        </template>
        <!-- <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[routePath.includes('news') ? activeClass : inactiveClass]"
          to="/news"
        >
          <div class="w-5 h-5 flex justify-center items-center">
            <i class="fa-solid fa-newspaper text-xl" />
          </div>
          <span class="mx-4">最新消息管理</span>
        </router-link>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[routePath.includes('products') ? activeClass : inactiveClass]"
          to="/products"
        >
          <div class="w-5 h-5 flex justify-center items-center">
            <i class="fa-solid fa-box text-xl" />
          </div>
          <span class="mx-4">商品管理</span>
        </router-link>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[routePath.includes('orders') ? activeClass : inactiveClass]"
          to="/orders"
        >
          <div class="w-5 h-5 flex justify-center items-center">
            <i class="fa-solid fa-clipboard-list text-xl" />
          </div>
          <span class="mx-4">訂單管理</span>
        </router-link>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[routePath.includes('coupons') ? activeClass : inactiveClass]"
          to="/coupons"
        >
          <div class="w-5 h-5 flex justify-center items-center">
            <i class="fa-solid fa-ticket text-xl" />
          </div>
          <span class="mx-4">優惠卷管理</span>
        </router-link>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[routePath.includes('members') ? activeClass : inactiveClass]"
          to="/members"
        >
          <div class="w-5 h-5 flex justify-center items-center">
            <i class="fa-solid fa-users text-xl" />
          </div>
          <span class="mx-4">會員管理</span>
        </router-link>

        <div class="relative">
          <a
            href="#"
            class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4 relative"
            :class="[inactiveClass]"
            @click.prevent="isShowAccountList = !isShowAccountList"
          >
            <div class="w-5 h-5 flex justify-center items-center">
              <i class="fa-solid fa-user-gear text-xl" />
            </div>
            <span class="mx-4 grow">後台帳號管理</span>
            <i class="fa-solid fa-chevron-up justify-items-end transition-transform duration-300 ease-in-out" :class="[isShowAccountList ? 'rotate-180' : 'rotate-0']" />
          </a>
          <ul class="transition-[height] overflow-hidden duration-300 ease-in-out" :class="[isShowAccountList ? 'h-28' : 'h-0']">
            <li>
              <router-link
                class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
                :class="[routePath.includes('/manager/accounts') ? activeClass : inactiveClass]"
                to="/manager/accounts"
              >
                <span class="mx-10">帳號列表</span>
              </router-link>
            </li>
            <li>
              <router-link
                class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
                :class="[routePath.includes('roles') ? activeClass : inactiveClass]"
                to="/manager/roles"
              >
                <span class="mx-10">角色列表</span>
              </router-link>
            </li>
          </ul>
        </div> -->

        <!-- <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Dashboard' ? activeClass : inactiveClass]"
          to="/dashboard"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 10C2 5.58172 5.58172 2 10 2V10H18C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10Z"
              fill="currentColor"
            />
            <path
              d="M12 2.25195C14.8113 2.97552 17.0245 5.18877 17.748 8.00004H12V2.25195Z"
              fill="currentColor"
            />
          </svg>

          <span class="mx-4">Dashboard</span>
        </router-link>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'UIElements' ? activeClass : inactiveClass]"
          to="/ui-elements"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 3C3.89543 3 3 3.89543 3 5V7C3 8.10457 3.89543 9 5 9H7C8.10457 9 9 8.10457 9 7V5C9 3.89543 8.10457 3 7 3H5Z"
              fill="currentColor"
            />
            <path
              d="M5 11C3.89543 11 3 11.8954 3 13V15C3 16.1046 3.89543 17 5 17H7C8.10457 17 9 16.1046 9 15V13C9 11.8954 8.10457 11 7 11H5Z"
              fill="currentColor"
            />
            <path
              d="M11 5C11 3.89543 11.8954 3 13 3H15C16.1046 3 17 3.89543 17 5V7C17 8.10457 16.1046 9 15 9H13C11.8954 9 11 8.10457 11 7V5Z"
              fill="currentColor"
            />
            <path
              d="M11 13C11 11.8954 11.8954 11 13 11H15C16.1046 11 17 11.8954 17 13V15C17 16.1046 16.1046 17 15 17H13C11.8954 17 11 16.1046 11 15V13Z"
              fill="currentColor"
            />
          </svg>

          <span class="mx-4">UI Elements</span>
        </router-link>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Tables' ? activeClass : inactiveClass]"
          to="/tables"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 3C6.44772 3 6 3.44772 6 4C6 4.55228 6.44772 5 7 5H13C13.5523 5 14 4.55228 14 4C14 3.44772 13.5523 3 13 3H7Z"
              fill="currentColor"
            />
            <path
              d="M4 7C4 6.44772 4.44772 6 5 6H15C15.5523 6 16 6.44772 16 7C16 7.55228 15.5523 8 15 8H5C4.44772 8 4 7.55228 4 7Z"
              fill="currentColor"
            />
            <path
              d="M2 11C2 9.89543 2.89543 9 4 9H16C17.1046 9 18 9.89543 18 11V15C18 16.1046 17.1046 17 16 17H4C2.89543 17 2 16.1046 2 15V11Z"
              fill="currentColor"
            />
          </svg>

          <span class="mx-4">Tables</span>
        </router-link>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Forms' ? activeClass : inactiveClass]"
          to="/forms"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
            />
            <path
              fill-rule="evenodd"
              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
              clip-rule="evenodd"
            />
          </svg>

          <span class="mx-4">Forms</span>
        </router-link>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Cards' ? activeClass : inactiveClass]"
          to="/cards"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
          </svg>

          <span class="mx-4">Cards</span>
        </router-link>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Modal' ? activeClass : inactiveClass]"
          to="/modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
            <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
            <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
          </svg>

          <span class="mx-4">Modal</span>
        </router-link>

        <router-link
          class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Blank' ? activeClass : inactiveClass]"
          to="/blank"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
            />
          </svg>

          <span class="mx-4">Blank</span>
        </router-link> -->
      </nav>
      <div class="flex justify-between items-center px-6 py-4 sticky bottom-0 left-0 w-full z-50 font-medium bg-gray-700">
        <span class="text-xl text-white">{{ adminUserInfo.account.value }}</span>
        <el-button class="w-10 h-10 text-primary" circle @click.prevent="logout">
          <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" size="lg" fixed-width />
        </el-button>
      </div>
    </div>
  </div>
</template>
