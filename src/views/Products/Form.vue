<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules, UploadRawFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { getErrorMessage } from '@/api/axios'
import type { ApiActionText } from '@/api/types'
import { createProduct, deleteProduct, getProduct, updateProduct } from '@/api/product/productHandler'
import type { ProductForm } from '@/api/product/types'
import type { routeType } from '@/util/route'
import { isAddPageType, isDeletePageType, isEditPageType } from '@/util/route'

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
const createForm = reactive<ProductForm>({
  title: '',
  category: '',
  price: 0,
  origin_price: 0,
  unit: '',
  description: '',
  content: '',
  status: 1,
  image_file: [],
  images_url: [],
})
const updateForm = reactive<ProductForm>({
  title: '',
  category: '',
  price: 0,
  origin_price: 0,
  unit: '',
  description: '',
  content: '',
  status: 1,
  image_file: [],
  images_url: [],
})

let form: typeof createForm | typeof updateForm
// 根據不同頁面狀態要有不同的 form
if (type && isAddPageType(type))
  form = createForm
else
  form = updateForm

const addRules = ref<FormRules>({
  title: {
    required: true,
    message: '商品名稱必填',
  },
  category: {
    required: true, message: '類別必填',
  },
  price: { required: true, type: 'integer', message: '商品售價必填' },
  origin_price: { required: true, type: 'integer', message: '商品原價必填' },
  unit: {
    required: true, message: '商品單位必填',
  },
  content: {
    required: true, message: '商品內容必填',
  },
  description: {
    required: true, message: '商品描述必填',
  },
  status: { required: true, type: 'integer', message: '商品是否啟用必填' },
  image_file: {
    required: true, message: '商品封面圖片必填',
  },
})
const editRules = ref<FormRules>({
  title: {
    required: true,
    message: '商品名稱必填',
  },
  category: {
    required: true, message: '類別必填',
  },
  price: { required: true, type: 'integer', message: '商品售價必填' },
  origin_price: { required: true, type: 'integer', message: '商品原價必填' },
  unit: {
    required: true, message: '商品單位必填',
  },
  content: {
    required: true, message: '商品內容必填',
  },
  description: {
    required: true, message: '商品描述必填',
  },
  status: { required: true, type: 'integer', message: '商品是否啟用必填' },
  image_file: {
    required: true, message: '商品封面圖片必填',
  },
})

// 處理會員圖片上傳
const uploadImageUrl = ref('')

function handleExceedImage(files: any) {
  const file = files[0] as UploadRawFile
  form.image_file[0] = file
  uploadImageUrl.value = URL.createObjectURL(file)
}

function uploadImageHandler(file: any, files: any) {
  if (file.raw.size / 1024 / 1024 > 5) {
    ElMessage({
      message: '圖片必須小於 5 MB',
      type: 'error',
    })
  }
  else {
    files[0] = file.raw
    uploadImageUrl.value = URL.createObjectURL(file.raw)
  }
}

function removeUploadImage() {
  form.image_file = []
  uploadImageUrl.value = ''
}

async function getAdminUserData() {
  try {
    const id: string = currentRoute.value.params.id as string
    const response = await getProduct(id)

    form.title = response.title
    form.category = response.category
    form.price = response.price
    form.origin_price = response.origin_price
    form.unit = response.unit
    form.description = response.description
    form.content = response.content
    form.status = response.status
    form.image_url = response.image_url
    form.images_url = response.images_url
  }
  catch (err: any) {
    ElMessage({
      message: `取得商品資訊失敗，${getErrorMessage(err)}`,
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
        await getAdminUserData()
        break
      case isDeletePageType(type):
        actionText.value = '刪除'
        await getAdminUserData()
        break
      default:
        break
    }
  }
})

async function onSubmit() {
  let actionMethods = () => createProduct(form)
  if (isEditPageType(pageType.value)) {
    const id: string = currentRoute.value.params.id as string
    actionMethods = () => updateProduct(form, id)
  }

  try {
    await actionMethods()

    ElMessage({
      message: `${actionText.value}商品成功`,
      type: 'success',
    })
    router.push({ name: 'ProductList' })
  }
  catch (err: any) {
    ElMessage({
      message: `${actionText.value}商品失敗，${getErrorMessage(err)}`,
      type: 'error',
    })
  }
}

async function deleteSubmit() {
  try {
    const id: string = currentRoute.value.params.id as string
    await deleteProduct(id)

    ElMessage({
      message: `${actionText.value}商品成功`,
      type: 'success',
    })
    router.push({ name: 'ProductList' })
  }
  catch (err: any) {
    ElMessage({
      message: `${actionText.value}商品失敗，${getErrorMessage(err)}`,
      type: 'error',
    })
  }
}
</script>

<template>
  <div class="mt-8">
    <el-form
      ref="formRef"
      class="mt-4" :rules="isAddPageType(pageType) ? addRules : editRules"
      :model="form"
      size="default"
      label-position="top" :scroll-to-error="true"
    >
      <div class="bg-white rounded-md shadow-md mb-6">
        <h2 class="text-lg font-semibold text-gray-700 capitalize px-6 py-4 border-b border-gray-200">
          商品圖片設定
        </h2>

        <el-row class="p-6 pb-0">
          <el-col>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="商品圖片（封面）" prop="image_file">
                  <el-upload
                    v-model:file-list="form.image_file"
                    action="none"
                    accept="image/*"
                    class="w-64 h-64 bg-gray-200 rounded flex items-center justify-center shadow"
                    :show-file-list="false"
                    :limit="1"
                    :auto-upload="false"
                    :on-exceed="handleExceedImage"
                    :on-change="uploadImageHandler"
                    :disabled="isDeletePageType(pageType)"
                  >
                    <!-- :before-remove="showDeleteModal" -->

                    <div
                      v-if="!uploadImageUrl"
                      class="flex flex-col items-center justify-center"
                    >
                      <el-icon class="el-icon--upload">
                        <FontAwesomeIcon :icon="['fas', 'cloud-arrow-up']" size="2xl" />
                      </el-icon>
                      <div class="el-upload__text pt-1">
                        選擇檔案
                      </div>
                    </div>
                    <div v-else class="h-full w-full bg-center bg-no-repeat bg-contain" :style="{ backgroundImage: `url(${uploadImageUrl})` }" />
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="18">
                <el-form-item label="其他圖片" prop="images_url">
                  <el-input v-model="form.images_url" class="mb-[18px]" placeholder="請輸入其他圖片網址" size="large" :disabled=" isDeletePageType(pageType)" />
                  <el-input v-model="form.images_url" class="mb-[18px]" placeholder="請輸入其他圖片網址" size="large" :disabled=" isDeletePageType(pageType)" />
                  <el-input v-model="form.images_url" class="mb-[18px]" placeholder="請輸入其他圖片網址" size="large" :disabled=" isDeletePageType(pageType)" />
                  <el-input v-model="form.images_url" placeholder="請輸入其他圖片網址" size="large" :disabled=" isDeletePageType(pageType)" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>

      <div class="bg-white rounded-md shadow-md mb-6">
        <h2 class="text-lg font-semibold text-gray-700 capitalize px-6 py-4 border-b border-gray-200">
          基本設定
        </h2>
        <el-row class="p-6 pb-0">
          <el-col>
            <el-row>
              <el-col>
                <el-form-item label="是否啟用上架" prop="status">
                  <el-select
                    v-model="form.status" class="w-full" size="large" placeholder="請選擇狀態"
                    :disabled="pageType === 'delete'"
                  >
                    <el-option v-for="status in statusOptions" :key="status.value" :label="status.name" :value="status.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="商品標題" prop="title">
                  <el-input v-model="form.title" placeholder="請輸入商品標題" size="large" :disabled="isDeletePageType(pageType)" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品類別" prop="category">
                  <el-input v-model="form.category" placeholder="請輸入商品類別" size="large" :disabled=" isDeletePageType(pageType)" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="商品描述" prop="description">
                  <el-input v-model="form.description" placeholder="請輸入商品描述" size="large" :disabled="isDeletePageType(pageType)" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品內容" prop="content">
                  <el-input v-model="form.content" placeholder="請輸入商品內容" size="large" :disabled=" isDeletePageType(pageType)" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="商品原價" prop="origin_price">
                  <el-input v-model="form.origin_price" placeholder="請輸入商品原價" size="large" :disabled=" isDeletePageType(pageType)" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品售價" prop="price">
                  <el-input v-model="form.price" placeholder="請輸入商品售價" size="large" :disabled="isDeletePageType(pageType)" />
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
              $router.push({ name: 'AccountList' })"
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
