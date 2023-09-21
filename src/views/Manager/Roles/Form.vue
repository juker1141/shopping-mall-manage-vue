<script setup lang="ts">
import { ref } from 'vue'

const formValue = ref({
  name: '',
  permissionList: [],
})

async function submitForm() {

}
</script>

<template>
  <div class="mt-8">
    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h2 class="text-lg font-semibold text-gray-700 capitalize">
          Account settings
        </h2>

        <form @submit.prevent="submitForm">
          <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label class="text-gray-700" for="name">Username</label>
              <input
                v-model="formValue.name"
                class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                type="text"
              >
            </div>
            <div>
              <label class="text-gray-700" for="permissionList">PermissionList</label>
              <input
                type="checkbox"
                class="w-5 h-5 text-indigo-600 rounded-md focus:ring-indigo-500"
                name="radio"
              ><span class="ml-2 text-gray-700">Checkbox</span>
            </div>

            <!-- <div>
              <label class="text-gray-700" for="emailAddress">Email Address</label>
              <input
                v-model="user.email"
                class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                type="email"
              >
            </div>

            <div>
              <label class="text-gray-700" for="password">Password</label>
              <input
                v-model="user."
                class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                type="password"
              >
            </div>

            <div>
              <label class="text-gray-700" for="passwordConfirmation">Password Confirmation</label>
              <input
                v-model="user.confirm"
                class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                type="password"
              > -->
            <!-- </div> -->
          </div>

          <div class="flex justify-end mt-4">
            <button
              class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
