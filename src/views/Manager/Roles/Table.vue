<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { RoleResponse } from '@/api/manager/types'
import { getRoles } from '@/api/manager/roleHandler'
import { formatDateTime } from '@/util/time'

const tableData = ref<RoleResponse[]>([])
const dataTotal = ref(0)
const currentPage = ref(1)

async function getRolesData() {
  try {
    const response = await getRoles(currentPage.value)
    tableData.value = response.data
    dataTotal.value = response.count
  }
  catch (err: any) {
    console.error(err)
  }
}

onMounted(async () => {
  await getRolesData()
})
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-end">
      <button class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500">
        <i class="fa-solid fa-user-plus mr-1 text-xl" />
        新增角色
      </button>
    </div>
    <div class="flex flex-col mt-8">
      <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div
          class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg"
        >
          <table class="min-w-full">
            <thead>
              <tr>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  角色名稱
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  權限
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50"
                >
                  建立日期
                </th>
                <th class="px-6 py-3 border-b border-gray-200 bg-gray-50" />
              </tr>
            </thead>

            <tbody class="bg-white">
              <tr v-for="(data, index) in tableData" :key="index">
                <td
                  class="px-6 py-4 border-b border-gray-200 whitespace-nowrap"
                >
                  <div class="flex items-center">
                    {{ data.name }}
                  </div>
                </td>

                <td
                  class="px-6 py-4 text-sm leading-5 text-gray-500 border-b border-gray-200 whitespace-nowrap"
                >
                  <span v-for="(p, pIndex) in data.permission_list" :key="p.name">
                    {{ p.name }}
                    <span v-if="pIndex !== data.permission_list.length - 1">、</span>
                    <br v-if="pIndex % 2 !== 0">
                  </span>
                </td>

                <td
                  class="px-6 py-4 text-sm leading-5 text-gray-500 border-b border-gray-200 whitespace-nowrap"
                >
                  {{ formatDateTime(data.created_at) }}
                </td>

                <td
                  class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap"
                >
                  <a href="#" class="text-indigo-600 hover:text-indigo-900">
                    <font-awesome-icon :icon="['fas', 'pen']" size="lg" />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
