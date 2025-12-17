<script setup lang="ts">
import { OrbitControls } from '@tresjs/cientos'
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize()
</script>

<template>
  <TresOrthographicCamera
    ref="refCamera"
    :position="[1, 1, 1]"
    :zoom="100"
    :near="0.1"
    :far="1000"
    :left="-width / 2"
    :right="width / 2"
    :top="height / 2"
    :bottom="-height / 2"
  />
  <!-- <TresPerspectiveCamera :position="[1, 1, 1]" ref="refCamera" /> -->
  <OrbitControls make-default />
  <TresMesh>
    <TresBoxGeometry :args="[1, 1]" />
    <TresMeshLambertMaterial color="orange" />
  </TresMesh>
  <TresDirectionalLight :position="[0, 5, 10]" :intensity="1" />
  <TresAmbientLight :intensity="0.5" />
</template>

<style scoped></style>
