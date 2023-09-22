<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { getErrorMessage } from '@/api/axios'
import { createRole, getRole, updateRole } from '@/api/manager/roleHandler'
import { getPermissions } from '@/api/manager/permissionHandler'
import type { ApiActionText } from '@/api/types'
import type { Permission, RoleForm } from '@/api/manager/types'
import type { routeType } from '@/util/route'
import { isEditPageType } from '@/util/route'

const router = useRouter()
const { currentRoute } = router
const pageType = ref<routeType>('add')

const actionText = ref<ApiActionText>('新增')
const permissions = ref<Permission[]>([])
const formRef = ref<FormInstance>()
const form = reactive<RoleForm>({
  name: '',
  permissions_id: [],
})

const rule = reactive<FormRules>({
  name: { required: true, type: 'string', message: '角色名稱必填' },
  permissions_id: {
    required: true,
    type: 'array',
    message: '權限必填',
  },
})

async function getPermissionsData() {
  try {
    const response = await getPermissions()
    permissions.value = response
  }
  catch (err: any) {
    console.log(err)
    ElMessage({
      message: `取得權限資訊失敗，${getErrorMessage(err)}`,
      type: 'error',
    })
  }
}

async function getRoleData() {
  try {
    const id: string = currentRoute.value.params.id as string
    const response = await getRole(id)

    form.name = response.name
    form.permissions_id = response.permission_list.map((p: Permission) => p.id)
  }
  catch (err: any) {
    ElMessage({
      message: `取得角色資訊失敗，${getErrorMessage(err)}`,
      type: 'error',
    })
  }
}

onMounted(async () => {
  await getPermissionsData()
  if (currentRoute.value.meta.type) {
    if (isEditPageType(currentRoute.value.meta.type)) {
      actionText.value = '更改'
      await getRoleData()
    }

    pageType.value = currentRoute.value.meta.type
  }
})

async function onSubmit() {
  let actionMethods = () => createRole(form)
  if (isEditPageType(pageType.value)) {
    const id: string = currentRoute.value.params.id as string
    actionMethods = () => updateRole(form, id)
  }

  try {
    await actionMethods()

    ElMessage({
      message: `${actionText.value}角色成功`,
      type: 'success',
    })
    router.push({ name: 'RoleList' })
  }
  catch (err: any) {
    ElMessage({
      message: `${actionText.value}角色失敗，${getErrorMessage(err)}`,
      type: 'error',
    })
  }
}
</script>

<template>
  <div class="mt-8">
    <el-form
      ref="formRef"
      class="mt-4"
      :rules="rule"
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
                <el-form-item label="角色名稱" prop="name" required>
                  <el-input v-model="form.name" placeholder="請輸入角色名稱" size="large" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="權限（可複選）" prop="permissions_id" size="large" required>
                  <el-checkbox-group v-model="form.permissions_id">
                    <el-checkbox v-for="item in permissions" :key="item.id" :label="item.id" name="type">
                      {{ item.name }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <div class="flex justify-center mt-4">
        <el-button
          class="shadow"
          aria-label="Cancel"
          size="large" @click.prevent="
            $router.push({ name: 'RoleList' })"
        >
          取消
        </el-button>
        <el-button
          class="shadow" size="large" type="primary" aria-label="Submit" @click="onSubmit"
        >
          {{ actionText }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>
