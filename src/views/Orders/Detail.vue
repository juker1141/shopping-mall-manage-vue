<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getErrorMessage } from '@/api/axios'
import type { OrderProductResponse, OrderResponse } from '@/api/order/types'
import { getOrder } from '@/api/order/orderHandler'

const router = useRouter()
const BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST
const { currentRoute } = router

const tableData = ref<OrderProductResponse[]>([])
const orderData = ref<OrderResponse>()

async function getOrderData() {
  try {
    const id: string = currentRoute.value.params.id as string
    const response = await getOrder(id)

    orderData.value = response
    tableData.value = response.product_list
  }
  catch (err: any) {
    ElMessage({
      message: `取得訂單資訊失敗，${getErrorMessage(err)}`,
      type: 'error',
    })
  }
}

const descountPrice = computed(() => {
  const total = orderData.value?.total_price || 0
  const final = orderData.value?.final_price || 0
  return total - final
})

onMounted(async () => {
  await getOrderData()
})
</script>

<template>
  <div class="mt-8">
    <div class="bg-white rounded-md shadow-md mb-6">
      <h2 class="text-lg font-semibold text-gray-700 capitalize px-6 py-4 border-b border-gray-200">
        訂單內容
      </h2>
      <el-row class="p-6">
        <el-col>
          <el-descriptions
            :column="4"
          >
            <el-descriptions-item>
              <template #label>
                <div class="flex items-center">
                  <el-icon class="pr-2">
                    <FontAwesomeIcon :icon="['fas', 'user']" />
                  </el-icon>
                  收件者
                </div>
              </template>
              {{ orderData?.full_name }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="flex items-center">
                  <el-icon class="pr-2">
                    <FontAwesomeIcon :icon="['fas', 'envelope']" />
                  </el-icon>
                  信箱
                </div>
              </template>
              {{ orderData?.email }}
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template #label>
                <div class="flex items-center">
                  <el-icon class="pr-2">
                    <FontAwesomeIcon :icon="['fas', 'clipboard-check']" />
                  </el-icon>
                  付款狀態
                </div>
              </template>
              <span v-if="orderData?.is_paid" class="text-success">
                已付款
              </span>
              <span v-else class="text-danger">
                未付款
              </span>
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template #label>
                <div class="flex items-center">
                  <el-icon class="pr-2">
                    <FontAwesomeIcon :icon="['fas', 'message']" />
                  </el-icon>
                  訂單狀態
                </div>
              </template>
              <strong>{{ orderData?.status.name }} : </strong>
              {{ orderData?.status.description }}
            </el-descriptions-item>
            <el-descriptions-item :span="2">
              <template #label>
                <div class="flex items-center">
                  <el-icon class="pr-2">
                    <FontAwesomeIcon :icon="['fas', 'location-dot']" />
                  </el-icon>
                  運送地址
                </div>
              </template>
              {{ orderData?.shipping_address }}
            </el-descriptions-item>
            <el-descriptions-item :span="4">
              <template #label>
                <div class="flex items-center">
                  <el-icon class="pr-2">
                    <FontAwesomeIcon :icon="['fas', 'message']" />
                  </el-icon>
                  留言
                </div>
              </template>
              {{ orderData?.message }}
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
    </div>

    <el-row>
      <el-col>
        <el-table :data="tableData" stripe :indent="20" size="large" class="rounded-md shadow-md mb-6">
          <el-table-column width="150">
            <template #default="scope">
              <div class="flex items-center">
                <el-avatar :size="80" :src="`${BACKEND_HOST}/${scope.row.image_url}`" shape="square" />
                <div class="ml-4" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="商品名稱" />
          <el-table-column prop="category" label="商品類別">
            <template #default="scope">
              <el-tag size="small">
                {{ scope.row.category }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="單價">
            <template #default="scope">
              <div class="flex items-center">
                <del v-if="scope.row.origin_price !== scope.row.price">
                  $ {{ scope.row.origin_price }}
                </del>
                <span class="pl-2">$ {{ scope.row.price }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="category" label="數量">
            <template #default="scope">
              {{ scope.row.num }} {{ scope.row.unit }}
            </template>
          </el-table-column>
          <el-table-column label="總價" width="100">
            <template #default="scope">
              $ {{ scope.row.price * scope.row.num }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row justify="end">
      <el-col :span="4" :offset="20" class="flex justify-between px-4 py-2">
        <strong>商品小計：</strong>$ {{ orderData?.total_price }}
      </el-col>
      <el-col :span="4" :offset="20" class="flex justify-between px-4 py-2">
        <strong>折扣：</strong>- $ {{ descountPrice }}
      </el-col>
      <el-col :span="4" :offset="20" class="flex justify-between px-4 py-2">
        <strong>訂單金額：</strong> $ {{ orderData?.final_price }}
      </el-col>
    </el-row>

    <div class="flex justify-center mt-4">
      <el-form-item>
        <el-button
          class="shadow"
          aria-label="Cancel"
          size="large" @click.prevent="
            $router.push({ name: 'OrderList' })"
        >
          返回
        </el-button>
      </el-form-item>
    </div>
  </div>
</template>
