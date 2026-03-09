<script setup lang="ts">
import { ref } from 'vue'
import { AnimatePresence, motion } from 'motion-v'

const isVisible = ref(true)

function toggleVisibility() {
  isVisible.value = !isVisible.value
}
</script>

<template>
  <div class="h-screen flex justify-center items-center flex-col">
    <AnimatePresence>
      <motion.div
        v-if="isVisible"
        class="w-25 h-25 bg-amber-200"
        :exit="{ opacity: 0 }"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
      >
        <motion.div :exit="{ y: 10 }">123123</motion.div>
      </motion.div>
    </AnimatePresence>
    <button @click="toggleVisibility">Toggle Visibility</button>
  </div>
</template>

<style scoped></style>
