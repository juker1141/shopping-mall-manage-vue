<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getErrorMessage } from '@/api/axios'
import { createRole, getRole, updateRole } from '@/api/manager/roleHandler'
import { getPermissions } from '@/api/manager/permissionHandler'
import type { Permission, RoleForm } from '@/api/manager/types'
import type { routeType } from '@/util/route'
import { isEditPageType } from '@/util/route'
import router from '@/router'

const route = useRoute()
const pageType = ref<routeType>('add')

const actionText = ref('新增')
const permissions = ref<Permission[]>([])
const form = reactive<RoleForm>({
  name: '',
  permissions_id: [],
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
    const id: string = route.params.id as string
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
  if (route.meta.type) {
    if (isEditPageType(route.meta.type)) {
      actionText.value = '儲存'
      await getRoleData()
    }

    pageType.value = route.meta.type
  }
})

async function onSubmit() {
  let actionMethods = () => createRole(form)
  if (isEditPageType(pageType.value)) {
    const id: string = route.params.id as string
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
    <div class="mt-4">
      <div class="bg-white rounded-md shadow-md">
        <h2 class="text-lg font-semibold text-gray-700 capitalize p-6 border-b border-gray-200">
          基本設定
        </h2>

        <el-form
          :model="form" class="p-6 pb-0"
          size="default"
          label-position="top"
        >
          <el-form-item label="角色名稱" prop="name" required>
            <el-input v-model="form.name" placeholder="請輸入角色名稱" size="large" class="focus:border-0" />
          </el-form-item>
          <el-form-item label="權限（可複選）" prop="permissions_id" size="large" required>
            <el-checkbox-group v-model="form.permissions_id">
              <el-checkbox v-for="item in permissions" :key="item.id" :label="item.id" name="type">
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <div class="flex justify-center mt-4">
            <el-form-item>
              <el-button
                aria-label="Cancel"
                size="large" @click.prevent="
                  $router.push({ name: 'RoleList' })"
              >
                取消
              </el-button>
              <el-button size="large" type="primary" aria-label="Submit" @click="onSubmit">
                {{ actionText }}
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
