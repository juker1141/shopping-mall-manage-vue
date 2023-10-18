<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { getErrorMessage } from '@/api/axios'
import type { ProductResponse } from '@/api/product/types'
import { getProducts, updateProductStatus } from '@/api/product/productHandler'
import { formatDateTime } from '@/util/time'

const router = useRouter()
const BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST

const load = ref(false)
const tableData = ref<ProductResponse[]>([])
const dataTotal = ref(0)
const currentPage = ref(1)

const switchInActive = 0
const switchActive = 1

async function getDatas(page = 1) {
  try {
    load.value = true
    const response = await getProducts(page)
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

async function switchStatus({ status, id }: ProductResponse) {
  try {
    load.value = true
    await updateProductStatus(status, id)
    await getDatas(currentPage.value)
    ElMessage({
      message: '更改商品狀態成功',
      type: 'success',
    })
  }
  catch (err: any) {
    ElMessage({
      message: '更改商品狀態失敗',
      type: 'success',
    })
  }
  finally {
    load.value = false
  }
}

function editData(id: number) {
  router.push({
    name: 'ProductEdit',
    params: {
      id,
    },
  })
}

function deleteData(id: number) {
  router.push({
    name: 'ProductDelete',
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
    <el-button type="primary" size="large" aria-label="Create" class="rounded-lg" @click="$router.push({ name: 'ProductAdd' })">
      <FontAwesomeIcon :icon="['fas', 'square-plus']" class="mr-2" size="lg" /> <span>新增商品</span>
    </el-button>
  </el-row>
  <el-row v-loading="load">
    <el-table :data="tableData" stripe :indent="20" size="large" class="rounded-lg">
      <el-table-column>
        <template #default="scope">
          <div class="flex items-center">
            <el-avatar :size="80" :src="`${BACKEND_HOST}/${scope.row.image_url}`" shape="square" />
            <div class="ml-4" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="商品名稱" />
      <el-table-column prop="category" label="類別" />
      <el-table-column label="價格 / 單位">
        <template #default="scope">
          <div class="flex flex-col">
            <del v-if="scope.row.origin_price !== scope.row.price">
              $ {{ scope.row.origin_price }} {{ scope.row.unit }}
            </del>
            <span>$ {{ scope.row.price }} {{ scope.row.unit }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="是否上架" width="100">
        <template #default="scope">
          <el-switch v-model="scope.row.status" :inactive-value="switchInActive" :active-value="switchActive" @change="switchStatus(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="created_by" label="建立人" width="100" />
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
