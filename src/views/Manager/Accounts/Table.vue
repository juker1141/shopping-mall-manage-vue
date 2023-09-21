<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { getErrorMessage } from '@/api/axios'
import type { AdminUserResponse } from '@/api/manager/types'
import { getAdminUsers } from '@/api/manager/adminUserHandler'
import { formatDateTime } from '@/util/time'

const router = useRouter()

const load = ref(false)
const tableData = ref<AdminUserResponse[]>([])
const dataTotal = ref(0)
const currentPage = ref(1)

async function getDatas(page = 1) {
  try {
    load.value = true
    const response = await getAdminUsers(page)
    tableData.value = response.data
    dataTotal.value = response.count
  }
  catch (err: any) {
    ElMessage({
      message: getErrorMessage(err),
      type: 'error',
    })
  }
  finally {
    load.value = false
  }
}

function editData(id: number) {
  router.push({
    name: 'AccountEdit',
    params: {
      id,
    },
  })
}

function deleteData(id: number) {
  router.push({
    name: 'AccountDelete',
    params: {
      id,
    },
  })
}

async function changePage(page: number) {
  await getDatas(page)
}

onMounted(async () => {
  await getDatas()
})
</script>

<template>
  <el-row justify="end" class="mb-4">
    <el-button type="primary" size="large" aria-label="Create" class="rounded-lg" @click="$router.push({ name: 'RoleAdd' })">
      <FontAwesomeIcon :icon="['fas', 'user-plus']" class="mr-2" size="lg" /> <span>新增帳號</span>
    </el-button>
  </el-row>
  <el-row v-loading="load">
    <el-table :data="tableData" stripe :indent="20" size="large" class="rounded-lg">
      <!-- id: number
  account: string
  full_name: string
  status: 0 | 1
  password_changed_at: string
  created_at: string -->
      <el-table-column prop="id" label="" />
      <el-table-column prop="full_name" label="名稱" />
      <el-table-column prop="permission_list" label="權限">
        <template #default="scope">
          <span v-for="(p, pIndex) in scope.row.permission_list" :key="p.name">
            {{ p.name }}
            <span v-if="pIndex !== scope.row.permission_list.length - 1">、</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="建立日期" width="200">
        <template #default="scope">
          {{ formatDateTime(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" link aria-label="Edit" @click.prevent="editData(scope.row.id)">
            <FontAwesomeIcon :icon="['fas', 'pen']" size="lg" />
          </el-button>
          <el-button type="primary" link aria-label="Edit" @click.prevent="deleteData(scope.row.id)">
            <FontAwesomeIcon :icon="['fas', 'user-slash']" size="lg" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
  <el-row justify="center">
    <el-pagination
      v-model:current-page="currentPage" class="mt-4" layout="prev, pager, next" :page-size="10"
      :total="dataTotal" background @update:current-page="changePage"
    />
  </el-row>
</template>
