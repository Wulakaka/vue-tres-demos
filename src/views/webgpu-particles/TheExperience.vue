<script setup lang="ts">
import { toValue } from 'vue'
import { WebGPURenderer } from 'three/webgpu'
import { OrbitControls } from '@tresjs/cientos'
import Particles from './components/TheParticles.vue'

import { TresCanvas, type TresRendererSetupContext } from '@tresjs/core'

// Create WebGPU renderer factory
const createWebGPURenderer = (ctx: TresRendererSetupContext) => {
  const renderer = new WebGPURenderer({
    canvas: toValue(ctx.canvas),
    // WebGPU specific configuration
    alpha: true,
    antialias: true,
  })
  return renderer
}
</script>

<template>
  <TresCanvas :renderer="createWebGPURenderer" window-size>
    <TresPerspectiveCamera :position="[-4.0, 3.0, 4.0]" />
    <OrbitControls />
    <Particles />
  </TresCanvas>
</template>
