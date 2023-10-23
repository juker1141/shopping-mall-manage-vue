<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { getErrorMessage } from '@/api/axios'
import type { ApiActionText } from '@/api/types'
import { createCoupon, deleteCoupon, getCoupon, updateCoupon } from '@/api/coupon/couponHandler'
import type { CouponForm } from '@/api/coupon/types'
import type { routeType } from '@/util/route'
import { isDeletePageType, isEditPageType } from '@/util/route'

const router = useRouter()
const BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST
const { currentRoute } = router
const pageType = ref<routeType>('add')
const type = currentRoute.value.meta.type

const actionText = ref<ApiActionText>('新增')
const isOpenModal = ref(false)
const statusOptions = ref([
  { name: '啟用', value: 1 },
  { name: '不啟用', value: 0 },
])
const formRef = ref<FormInstance>()
const form = reactive<CouponForm>({
  title: '',
  code: '',
  percent: 0,
  start_at: '',
  expires_at: '',
})

const rules = ref<FormRules>({
  title: {
    required: true,
    message: '優惠卷名稱必填',
  },
  code: {
    required: true, message: '優惠卷代碼必填',
  },
  percent: {
    required: true, type: 'number', message: '優惠卷折扣必填',
  },
})

async function getCouponData() {
  try {
    const id: string = currentRoute.value.params.id as string
    const response = await getCoupon(id)

    form.title = response.title
    form.code = response.code
    form.percent = response.percent
    form.start_at = response.start_at
    form.expires_at = response.expires_at
  }
  catch (err: any) {
    ElMessage({
      message: `取得優惠卷資訊失敗，${getErrorMessage(err)}`,
      type: 'error',
    })
  }
}

onMounted(async () => {
  if (type) {
    pageType.value = type
    switch (true) {
      case isEditPageType(type):
        actionText.value = '更改'
        await getCouponData()
        break
      case isDeletePageType(type):
        actionText.value = '刪除'
        await getCouponData()
        break
      default:
        break
    }
  }
})

async function onSubmit() {
  let actionMethods = () => createCoupon(form)
  if (isEditPageType(pageType.value)) {
    const id: string = currentRoute.value.params.id as string
    actionMethods = () => updateCoupon(form, id)
  }

  try {
    await actionMethods()

    ElMessage({
      message: `${actionText.value}優惠卷成功`,
      type: 'success',
    })
    router.push({ name: 'CouponList' })
  }
  catch (err: any) {
    console.log(err)
    ElMessage({
      message: `${actionText.value}優惠卷失敗，${getErrorMessage(err)}`,
      type: 'error',
    })
  }
}

async function deleteSubmit() {
  try {
    const id: string = currentRoute.value.params.id as string
    await deleteCoupon(id)

    ElMessage({
      message: `${actionText.value}優惠卷成功`,
      type: 'success',
    })
    router.push({ name: 'CouponList' })
  }
  catch (err: any) {
    ElMessage({
      message: `${actionText.value}優惠卷失敗，${getErrorMessage(err)}`,
      type: 'error',
    })
  }
}
</script>

<template>
  <div class="mt-8">
    <el-form
      ref="formRef"
      class="mt-4" :rules="rules"
      :model="form"
      size="default"
      label-position="top" :scroll-to-error="true"
    >
      <div class="bg-white rounded-md shadow-md mb-6">
        <h2 class="text-lg font-semibold text-gray-700 capitalize px-6 py-4 border-b border-gray-200">
          基本設定
        </h2>
        <el-row class="p-6 pb-0">
          <el-col>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="優惠卷標題" prop="title">
                  <el-input v-model="form.title" placeholder="請輸入優惠卷標題" size="large" :disabled="isDeletePageType(pageType)" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="優惠卷代碼" prop="code">
                  <el-input v-model="form.code" placeholder="請輸入優惠卷代碼" size="large" :disabled=" isDeletePageType(pageType)" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="優惠卷折扣" prop="percent">
                  <el-input v-model.number="form.percent" placeholder="請輸入優惠卷折扣" size="large" type="number" :disabled="isDeletePageType(pageType)" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="開始時間" prop="start_at">
                  <el-date-picker
                    v-model="form.start_at" size="large" type="datetime" placeholder="請選擇開始時間" style="width:100%" :disabled="isDeletePageType(pageType)"
                  />
                  <span class="text-danger text-xs pt-2 block">選擇開始時間，沒填儲存後立即生效</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="結束時間" prop="expires_at">
                  <el-date-picker
                    v-model="form.expires_at" size="large" type="datetime" placeholder="請選擇結束時間" style="width:100%" :disabled="isDeletePageType(pageType)"
                  />
                  <span class="text-danger text-xs pt-2 block">選擇結束時間，沒填則永不過期</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>

      <div class="flex justify-center mt-4">
        <el-form-item>
          <el-button
            class="shadow"
            aria-label="Cancel"
            size="large" @click.prevent="
              $router.push({ name: 'CouponList' })"
          >
            取消
          </el-button>
          <el-button
            v-if="!isDeletePageType(pageType)"
            class="shadow"
            size="large"
            type="primary"
            aria-label="Submit"
            @click="onSubmit"
          >
            {{ actionText }}
          </el-button>
          <el-button
            v-else
            class="shadow"
            size="large"
            type="danger"
            aria-label="Delete"
            @click.prevent="isOpenModal = true"
          >
            {{ actionText }}
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
  <el-dialog v-model="isOpenModal" title="警告" width="30%" center>
    <strong>
      是否確認刪除
    </strong>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isOpenModal = false">取消</el-button>
        <el-button type="danger" @click="deleteSubmit">
          確認刪除
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss">
.el-upload {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
