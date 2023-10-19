<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules, UploadRawFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { getErrorMessage } from '@/api/axios'
import type { ApiActionText } from '@/api/types'
import { deleteMemberUser, getMemberUser, updateMemberUser } from '@/api/member/memberUserHandler'
import type { MemberUserForm } from '@/api/member/types'
import type { routeType } from '@/util/route'
import { isDeletePageType, isEditPageType } from '@/util/route'

const router = useRouter()
const { currentRoute } = router
const BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST
const pageType = ref<routeType>('edit')
const type = currentRoute.value.meta.type

const actionText = ref<ApiActionText>('更改')
const isOpenModal = ref(false)
const statusOptions = ref([
  { name: '啟用', value: 1 },
  { name: '不啟用', value: 0 },
])
const formRef = ref<FormInstance>()
const form = reactive<MemberUserForm>({
  account: '',
  email: '',
  full_name: '',
  cellphone: '',
  address: '',
  shipping_address: '',
  post_code: '',
  status: 1,
  new_password: '',
  old_password: '',
  avatar_file: [],
})

function validatorPassword(rules: any, value: any, callback: any) {
  if (rules.required && value.length <= 0)
    callback(new Error('密碼必填'))
  else if (!rules.required && value.length === 0)
    callback()
  else if (value.length < 8 || value.length > 16)
    callback(new Error(' '))
  else
    callback()
}

function validatorNewPassword(rules: any, value: any, callback: any) {
  if (value === '' && rules.required)
    callback(new Error('新密碼必填'))
  else if (value === form.old_password)
    callback(new Error('請輸入新的密碼'))
  else if (!rules.required && value.length === 0)
    callback()
  else if (value.length < 8 || value.length > 16)
    callback(new Error(' '))
  else
    callback()
}

const rules = ref<FormRules>({
  status: { required: true, type: 'integer', message: '狀態必填' },
  name: { required: true, message: '姓名必填' },
  password: {
    required: false,
    min: 8,
    max: 16,
    validator: validatorPassword,
  },
  confirmPassword: {
    required: false,
    min: 8,
    max: 16,
    validator: validatorNewPassword,
  },
})

// 處理會員圖片上傳
const uploadImageUrl = ref('')
const defaultAvatarUrl = ref(`${BACKEND_HOST}/static/avatar_images/default_avatar.png`)

function handleExceedImage(files: any) {
  const file = files[0] as UploadRawFile
  form.avatar_file[0] = file
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
  form.avatar_file = []
  uploadImageUrl.value = ''
}

async function getMemberUserData() {
  try {
    const id: string = currentRoute.value.params.id as string
    const response = await getMemberUser(id)

    form.account = response.account
    form.full_name = response.full_name
    form.status = response.status
    form.email = response.email
    form.cellphone = response.cellphone
    form.address = response.address
    form.shipping_address = response.shipping_address
    form.post_code = response.post_code
    if (!response.avatar_url.includes('default_avatar.png'))
      uploadImageUrl.value = `${BACKEND_HOST}/${response.avatar_url}`
  }
  catch (err: any) {
    ElMessage({
      message: `取得帳號資訊失敗，${getErrorMessage(err)}`,
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
        await getMemberUserData()
        break
      case isDeletePageType(type):
        actionText.value = '刪除'
        await getMemberUserData()
        break
      default:
        break
    }
  }
})

async function onSubmit() {
  try {
    const id: string = currentRoute.value.params.id as string
    await updateMemberUser(form, id)

    ElMessage({
      message: `${actionText.value}會員帳號成功`,
      type: 'success',
    })
    router.push({ name: 'MemberList' })
  }
  catch (err: any) {
    ElMessage({
      message: `${actionText.value}會員帳號失敗，${getErrorMessage(err)}`,
      type: 'error',
    })
  }
}

async function deleteSubmit() {
  try {
    const id: string = currentRoute.value.params.id as string
    await deleteMemberUser(id)

    ElMessage({
      message: `${actionText.value}會員帳號成功`,
      type: 'success',
    })
    router.push({ name: 'MemberList' })
  }
  catch (err: any) {
    ElMessage({
      message: `${actionText.value}會員帳號失敗，${getErrorMessage(err)}`,
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
                <el-form-item label="頭像" prop="avatar_file">
                  <div class="w-36 h-36 relative rounded-full shadow">
                    <div v-if="uploadImageUrl">
                      <div v-if="uploadImageUrl" class="w-36 h-36 bg-center bg-no-repeat bg-cover rounded-full" :style="{ backgroundImage: `url(${uploadImageUrl})` }" />
                      <el-button class="absolute top-0 left-0 w-36 h-36 flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-white/90 rounded-full" @click.prevent="removeUploadImage">
                        <FontAwesomeIcon :icon="['fas', 'trash']" size="2xl" class="text-primary" />
                      </el-button>
                    </div>
                    <img v-else :src="defaultAvatarUrl" alt="default" class="rounded-full">
                    <el-upload
                      v-model:file-list="form.avatar_file"
                      action="none"
                      accept="image/*"
                      class="absolute bottom-2 right-2 border bg-white w-8 h-8 flex justify-center items-center rounded-full"
                      :show-file-list="false"
                      :limit="1"
                      :auto-upload="false"
                      :on-exceed="handleExceedImage"
                      :on-change="uploadImageHandler"
                      :disabled="isDeletePageType(pageType)"
                    >
                      <!-- :before-remove="showDeleteModal" -->
                      <FontAwesomeIcon :icon="['fas', 'camera']" size="lg" />
                    </el-upload>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="帳號" prop="account">
                  <el-input v-model="form.account" placeholder="請輸入帳號" size="large" :disabled="true" />
                </el-form-item>
                <el-form-item label="信箱" prop="email">
                  <el-input v-model="form.email" placeholder="請輸入信箱" size="large" :disabled="isEditPageType(pageType) || isDeletePageType(pageType)" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="狀態" prop="status">
                  <el-select
                    v-model="form.status" class="w-full" size="large" placeholder="請選擇狀態"
                    :disabled="pageType === 'delete'"
                  >
                    <el-option v-for="status in statusOptions" :key="status.value" :label="status.name" :value="status.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="姓名" prop="full_name">
                  <el-input v-model="form.full_name" placeholder="請輸入姓名" size="large" :disabled="isDeletePageType(pageType)" />
                  <span class="text-danger text-xs pt-2 block pl-1">
                    不可輸入特殊符號及數字
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="舊密碼" prop="old_password">
                  <el-input
                    v-model="form.old_password" size="large" show-password maxlength="16" minlength="8"
                    placeholder="請輸入舊密碼" autocomplete="off"
                  />
                  <span class="text-danger text-xs pt-2 block pl-1">
                    密碼需8到16個字
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="新密碼" prop="new_password">
                  <el-input
                    v-model="form.new_password" size="large" maxlength="16" minlength="8" show-password
                    autocomplete="off" placeholder="請輸入新密碼"
                  />
                  <span class="text-danger text-xs pt-2 block pl-1">
                    密碼需8到16個字
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>

      <div class="bg-white rounded-md shadow-md mb-6">
        <h2 class="text-lg font-semibold text-gray-700 capitalize px-6 py-4 border-b border-gray-200">
          會員資料
        </h2>
        <el-row class="p-6 pb-0">
          <el-col>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="手機" prop="cellphone">
                  <el-input v-model="form.cellphone" placeholder="請輸入手機電話" size="large" :disabled="isDeletePageType(pageType)" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="郵遞區號" prop="post_code">
                  <el-input v-model="form.post_code" placeholder="請輸入郵遞區號" size="large" :disabled="isDeletePageType(pageType)" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="地址" prop="address">
                  <el-input v-model="form.address" placeholder="請輸入地址" size="large" :disabled="isDeletePageType(pageType)" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="寄送地址" prop="shipping_address">
                  <el-input v-model="form.shipping_address" placeholder="請輸入寄送地址" size="large" :disabled="isDeletePageType(pageType)" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>

      <!-- <div class="bg-white rounded-md shadow-md mb-6">
        <h2 class="text-lg font-semibold text-gray-700 capitalize px-6 py-4 border-b border-gray-200">
          角色設定
        </h2>

        <el-row class="p-6 pb-0">
          <el-col>
            <el-form-item label="角色" prop="role_id" required>
              <el-radio-group
                v-model="form.role_id" class="ml-4 w-full" size="large"
                :disabled="isDeletePageType(pageType)"
              >
                <el-radio v-for="role in roles" :key="role.id" :label="role.id" size="large">
                  {{ role.name }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </div> -->

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
