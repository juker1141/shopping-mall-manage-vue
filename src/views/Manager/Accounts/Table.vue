<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { getErrorMessage } from '@/api/axios'
import type { AdminUserResponse } from '@/api/manager/types'
import { getAdminUsers, updateAdminUserStatus } from '@/api/manager/adminUserHandler'
import { formatDateTime } from '@/util/time'
import { useAdminUserStore } from '@/stores/AdminUserStore'

const router = useRouter()
const adminUserInfo = storeToRefs(useAdminUserStore())

const load = ref(false)
const tableData = ref<AdminUserResponse[]>([])
const dataTotal = ref(0)
const currentPage = ref(1)

const switchInActive = 0
const switchActive = 1

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

async function switchStatus({ status, id }: AdminUserResponse) {
  try {
    load.value = true
    await updateAdminUserStatus(status, id)
    await getDatas(currentPage.value)
    ElMessage({
      message: '更改帳號狀態成功',
      type: 'success',
    })
  }
  catch (err: any) {
    ElMessage({
      message: '更改帳號狀態失敗',
      type: 'success',
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

function isCurrentAccount(id: number): boolean {
  if (adminUserInfo.id.value === id)
    return true
  return false
}
</script>

<template>
  <el-row justify="end" class="mb-4">
    <el-button type="primary" size="large" aria-label="Create" class="rounded-lg" @click="$router.push({ name: 'AccountAdd' })">
      <FontAwesomeIcon :icon="['fas', 'user-plus']" class="mr-2" size="lg" /> <span>新增帳號</span>
    </el-button>
  </el-row>
  <el-row v-loading="load">
    <el-table :data="tableData" stripe :indent="20" size="large" class="rounded-lg">
      <el-table-column prop="full_name" label="姓名" />
      <el-table-column prop="account" label="帳號" />
      <el-table-column label="角色">
        <template #default="scope">
          {{ scope.row.role.name }}
        </template>
      </el-table-column>
      <el-table-column label="狀態" width="100">
        <template #default="scope">
          <el-switch v-model="scope.row.status" :inactive-value="switchInActive" :active-value="switchActive" :disabled="isCurrentAccount(scope.row.id)" @change="switchStatus(scope.row)" />
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
          <el-button type="primary" link aria-label="Delete" @click.prevent="deleteData(scope.row.id)">
            <FontAwesomeIcon :icon="['fas', 'trash']" size="lg" />
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
