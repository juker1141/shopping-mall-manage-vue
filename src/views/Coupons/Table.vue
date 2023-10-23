<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { getErrorMessage } from '@/api/axios'
import type { CouponResponse } from '@/api/coupon/types'
import { getCoupons } from '@/api/coupon/couponHandler'
import { formatDateTime } from '@/util/time'

const router = useRouter()

const load = ref(false)
const tableData = ref<CouponResponse[]>([])
const dataTotal = ref(0)
const currentPage = ref(1)

async function getDatas(page = 1) {
  try {
    load.value = true
    const response = await getCoupons(page)
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
    name: 'CouponEdit',
    params: {
      id,
    },
  })
}

function deleteData(id: number) {
  router.push({
    name: 'CouponDelete',
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
    <el-button type="primary" size="large" aria-label="Create" class="rounded-lg" @click="$router.push({ name: 'CouponAdd' })">
      <FontAwesomeIcon :icon="['fas', 'plus']" class="mr-2" size="lg" /> <span>新增優惠卷</span>
    </el-button>
  </el-row>
  <el-row v-loading="load">
    <el-table :data="tableData" stripe :indent="20" size="large" class="rounded-lg">
      <el-table-column prop="title" label="優惠卷名稱" />
      <el-table-column prop="code" label="優惠卷代碼" />
      <el-table-column label="折扣" width="100">
        <template #default="scope">
          {{ scope.row.percent }} %
        </template>
      </el-table-column>
      <el-table-column prop="start_at" label="開始日期">
        <template #default="scope">
          {{ formatDateTime(scope.row.start_at) }}
        </template>
      </el-table-column>
      <el-table-column prop="expires_at" label="結束日期">
        <template #default="scope">
          {{ formatDateTime(scope.row.expires_at) }}
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
