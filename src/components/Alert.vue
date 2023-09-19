<script setup lang="ts">
import { ref } from 'vue'

interface Notification {
  message: string
  type: string
  typeClass: string
}

const notifications = ref<Notification[]>([])

function show(message: string, type = 'success') {
  const notification = {
    message,
    type,
    typeClass: `bg-${type}-500`,
  }
  notifications.value.push(notification)
  setTimeout(() => {
    hide(notification)
  }, 3000) // 3秒后自动隐藏
}

function hide(notification: Notification) {
  const index = notifications.value.indexOf(notification)
  if (index > -1)
    notifications.value.splice(index, 1)
}
</script>

<template>
  <div v-for="(notification, index) in notifications" :key="index" class="fixed bottom-0 left-0 right-0 p-4 bg-green-500 text-white shadow-lg" :class="notification.typeClass">
    {{ notification.message }}
  </div>
</template>
