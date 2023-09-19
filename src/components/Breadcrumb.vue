<script setup lang="ts">
const props = defineProps({
  breadcrumb: Object,
  pageTitle: String,
})
</script>

<script lang="ts">
export default {
  name: 'BreadcrumbComponent',
}
</script>

<template>
  <!-- Breadcrumb -->
  <nav class="flex text-gray-700 font-medium py-3 px-5" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center">
        <a href="#" class="">
          <i class="fa-solid fa-house mr-1" />
          首頁
        </a>
      </li>
      <li v-for="(value, key) in props.breadcrumb" :key="key" class="flex items-center">
        <i class="fa-solid fa-chevron-right mr-3" />
        <div v-if="key === props.pageTitle" class="flex items-center" :class="[key === props.pageTitle && 'text-gray-500 font-normal']">
          {{ key }}
        </div>
        <router-link v-else :to="{ path: value }">
          <div class="flex items-center" :class="[key === props.pageTitle && 'text-gray-500 font-normal']">
            {{ key }}
          </div>
        </router-link>
      </li>
    </ol>
  </nav>
</template>
