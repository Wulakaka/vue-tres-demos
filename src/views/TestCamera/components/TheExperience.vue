<script setup lang="ts">
import { OrbitControls } from '@tresjs/cientos'
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize()
</script>

<template>
  <TresOrthographicCamera
    :position="[0, 0, 10]"
    :zoom="100"
    :near="0.1"
    :far="1000"
    :left="-width / 2"
    :right="width / 2"
    :top="height / 2"
    :bottom="-height / 2"
  />
  <OrbitControls />
  <TresMesh>
    <TresBoxGeometry :args="[1, 1]" />
    <TresMeshBasicMaterial color="orange" />
  </TresMesh>
</template>

<style scoped></style>
