<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import TheExperience from './components/TheExperience.vue'
</script>

<template>
  <TresCanvas window-size :tone-mapping-exposure="3">
    <TheExperience />
  </TresCanvas>
</template>

<style scoped></style>
