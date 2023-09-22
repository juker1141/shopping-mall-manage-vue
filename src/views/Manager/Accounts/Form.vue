<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { getErrorMessage } from '@/api/axios'
import type { ApiActionText } from '@/api/types'
import { getRolesOption } from '@/api/manager/roleHandler'
import { createAdminUser, deleteAdminUser, getAdminUser, updateAdminUser } from '@/api/manager/adminUserHandler'
import type { AdminUserForm, Role } from '@/api/manager/types'
import type { routeType } from '@/util/route'
import { isAddPageType, isDeletePageType, isEditPageType } from '@/util/route'

const router = useRouter()
const { currentRoute } = router
const pageType = ref<routeType>('add')
const type = currentRoute.value.meta.type

const actionText = ref<ApiActionText>('新增')
const isOpenModal = ref(false)
const roles = ref<Role[]>([])
const statusOptions = ref([
  { name: '啟用', value: 1 },
  { name: '不啟用', value: 0 },
])
const formRef = ref<FormInstance>()
const createForm = reactive<AdminUserForm>({
  account: '',
  full_name: '',
  status: 1,
  password: '',
  confirmPassword: '',
  role_id: 0,
})
const updateForm = reactive<AdminUserForm>({
  account: '',
  full_name: '',
  status: 1,
  new_password: '',
  old_password: '',
  role_id: 0,
})

let form: typeof createForm | typeof updateForm
// 根據不同頁面狀態要有不同的 form
if (type && isAddPageType(type))
  form = createForm
else
  form = updateForm

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

function validatorConfirmPassword(rules: any, value: any, callback: any) {
  if (value === '' && rules.required)
    callback(new Error('密碼確認必填'))
  else if (value !== form.password)
    callback(new Error('密碼確認必須與密碼必須一致'))
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
  else if (value === form.password)
    callback(new Error('請輸入新的密碼'))
  else if (!rules.required && value.length === 0)
    callback()
  else if (value.length < 8 || value.length > 16)
    callback(new Error(' '))
  else
    callback()
}

const addRules = ref<FormRules>({
  account: {
    required: true,
    message: '帳號必填',
  },
  full_name: {
    required: true, message: '姓名必填',
  },
  status: { required: true, type: 'integer', message: '狀態必填' },
  role_id: { required: true, type: 'integer', message: '角色必填' },
  password: {
    required: true,
    min: 8,
    max: 16,
    validator: validatorPassword,
  },
  confirmPassword: {
    required: true,
    min: 8,
    max: 16,
    validator: validatorConfirmPassword,
  },
})
const editRules = ref<FormRules>({
  status: { required: true, type: 'integer', message: '狀態必填' },
  roleList: { required: true, type: 'array', message: '角色必填' },
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

async function getRolesOptionData() {
  try {
    const response = await getRolesOption()
    roles.value = response.roles
  }
  catch (err: any) {
    console.error(err)
    ElMessage({
      message: `取得角色資訊失敗，${getErrorMessage(err)}`,
      type: 'error',
    })
  }
}

async function getAdminUserData() {
  try {
    const id: string = currentRoute.value.params.id as string
    const response = await getAdminUser(id)

    form.account = response.account
    form.full_name = response.full_name
    form.status = response.status
    form.role_id = response.role_id
  }
  catch (err: any) {
    ElMessage({
      message: `取得帳號資訊失敗，${getErrorMessage(err)}`,
      type: 'error',
    })
  }
}

onMounted(async () => {
  await getRolesOptionData()
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
  let actionMethods = () => createAdminUser(form)
  if (isEditPageType(pageType.value)) {
    const id: string = currentRoute.value.params.id as string
    actionMethods = () => updateAdminUser(form, id)
  }

  try {
    await actionMethods()

    ElMessage({
      message: `${actionText.value}帳號成功`,
      type: 'success',
    })
    router.push({ name: 'AccountList' })
  }
  catch (err: any) {
    ElMessage({
      message: `${actionText.value}帳號失敗，${getErrorMessage(err)}`,
      type: 'error',
    })
  }
}

async function deleteSubmit() {
  try {
    const id: string = currentRoute.value.params.id as string
    await deleteAdminUser(id)

    ElMessage({
      message: `${actionText.value}帳號成功`,
      type: 'success',
    })
    router.push({ name: 'AccountList' })
  }
  catch (err: any) {
    ElMessage({
      message: `${actionText.value}帳號失敗，${getErrorMessage(err)}`,
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
          基本設定
        </h2>
        <el-row class="p-6 pb-0">
          <el-col>
            <el-row>
              <el-col>
                <el-form-item label="狀態" prop="status">
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
                <el-form-item label="姓名" prop="full_name">
                  <el-input v-model="form.full_name" placeholder="請輸入姓名" size="large" :disabled="isDeletePageType(pageType)" />
                  <span class="text-danger text-xs pt-2 block pl-1">
                    不可輸入特殊符號及數字
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="帳號" prop="account">
                  <el-input v-model="form.account" placeholder="請輸入帳號" size="large" :disabled="isEditPageType(pageType) || isDeletePageType(pageType)" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="isAddPageType(pageType)" :gutter="20">
              <el-col :span="12">
                <el-form-item label="密碼" prop="password" required>
                  <el-input
                    v-model="form.password" size="large" show-password maxlength="16" minlength="8"
                    placeholder="請輸入密碼" autocomplete="off"
                  />
                  <span class="text-danger text-xs pt-2 block pl-1">
                    密碼需8到16個字
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="密碼確認" prop="confirmPassword" required>
                  <el-input
                    v-model="form.confirmPassword" size="large" maxlength="16" minlength="8" show-password
                    autocomplete="off" placeholder="請確認密碼"
                  />
                  <span class="text-danger text-xs pt-2 block pl-1">
                    密碼需8到16個字
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="isEditPageType(pageType)" :gutter="20">
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
