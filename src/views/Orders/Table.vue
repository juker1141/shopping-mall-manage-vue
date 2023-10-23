<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getErrorMessage } from '@/api/axios'
import type { OrderResponse } from '@/api/order/types'
import { getOrders } from '@/api/order/orderHandler'
import { formatDateTime } from '@/util/time'

const router = useRouter()

const load = ref(false)
const tableData = ref<OrderResponse[]>([])
const dataTotal = ref(0)
const currentPage = ref(1)

async function getDatas(page = 1) {
  try {
    load.value = true
    const response = await getOrders(page)
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

function viewData(id: number) {
  router.push({
    name: 'OrderDetail',
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
  <el-row v-loading="load">
    <el-table :data="tableData" stripe :indent="20" size="large" class="rounded-lg">
      <el-table-column prop="id" label="訂單編號" width="100" />
      <el-table-column label="會員姓名 / 信箱">
        <template #default="scope">
          <div class="text-sm font-medium leading-5 text-gray-900">
            {{ scope.row.full_name }}
          </div>
          <div class="text-sm leading-5 text-gray-500">
            {{ scope.row.email }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="訂單金額">
        <template #default="scope">
          <div class="flex items-center">
            <del v-if="scope.row.total_price !== scope.row.final_price">
              $ {{ scope.row.total_price }}
            </del>
            <span class="pl-1">$ {{ scope.row.final_price }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="is_paid" label="付款狀態">
        <template #default="scope">
          <span v-if="scope.row.is_paid" class="text-success">
            已付款
          </span>
          <span v-else class="text-danger">
            未付款
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="訂單狀態">
        <template #default="scope">
          {{ scope.row.status.name }}
        </template>
      </el-table-column>
      <el-table-column label="訂購日期">
        <template #default="scope">
          {{ formatDateTime(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button type="primary" aria-label="View" @click.prevent="viewData(scope.row.id)">
            查看
          </el-button>
          <!-- <el-button type="primary" link aria-label="Delete" @click.prevent="deleteData(scope.row.id)">
            <FontAwesomeIcon :icon="['fas', 'trash']" size="lg" />
          </el-button> -->
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
