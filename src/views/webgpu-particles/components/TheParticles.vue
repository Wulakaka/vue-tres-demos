<script setup lang="ts">
import { useTres } from '@tresjs/core'
import { mix, smoothstep, uv, vec2, vec4, type int } from 'three/tsl'
import {
  cos,
  distance,
  float,
  Fn,
  fract,
  instancedArray,
  instanceIndex,
  min,
  mul,
  PI,
  PI2,
  sin,
  sqrt,
  vec3,
} from 'three/tsl'
import { AdditiveBlending, SpriteNodeMaterial, WebGPURenderer } from 'three/webgpu'
import { onMounted } from 'vue'

const COUNT = 1024

const { renderer } = useTres()

const { nodes } = (() => {
  const spawnPositionBuffer = instancedArray(COUNT, 'vec3')

  const spawnPosition = spawnPositionBuffer.element(instanceIndex)

  const hash = Fn(([index]: [number]) => {
    return fract(sin(float(index).mul(12.9898)).mul(43758.5453))
  })

  const computeInit = Fn(
    ({
      spawnPositions,
      index,
    }: {
      spawnPositions: ReturnType<typeof instancedArray>
      index: ReturnType<typeof int>
    }) => {
      const h0 = hash(index)
      const h1 = hash(index.add(1))
      const h2 = hash(index.add(2))

      const dist = sqrt(h0.mul(4))
      const theta = h1.mul(PI2)
      const phi = h2.mul(PI)

      const x = mul(dist, sin(phi), cos(theta))
      const y = mul(dist, sin(phi), sin(theta))
      const z = mul(dist, cos(phi))

      spawnPositions.element(index).assign(vec3(x, y, z))
    },
  )

  const computeNode = computeInit({
    spawnPositions: spawnPositionBuffer,
    index: instanceIndex,
  }).compute(COUNT)

  const positionNode = Fn(() => {
    const pos = spawnPosition
    return pos
  })()

  const scaleNode = Fn(() => {
    const randValue = Fn(({ min, max, seed }: { min: number; max: number; seed: number }) => {
      return hash(seed).mul(float(max).sub(min)).add(min)
    })

    return randValue({ min: 0.01, max: 0.04, seed: 3 })
  })()

  const particleColor = Fn(
    ({
      spawnPos,
      uvCoord,
    }: {
      spawnPos: ReturnType<typeof vec3>
      uvCoord: ReturnType<typeof vec2>
    }) => {
      const baseColor = vec3(0.24, 0.43, 0.96)
      const distanceToCenter = min(distance(spawnPos, vec3(0)), 2.75)

      const strength = distance(uvCoord, vec2(0.5))

      const distColor = mix(vec3(0.97, 0.7, 0.45), baseColor, distanceToCenter.mul(0.4))

      const fillMask = float(1).sub(strength.mul(2))
      const finalColor = mix(vec3(0), distColor, fillMask)

      const circle = smoothstep(0.5, 0.49, strength)
      return vec4(finalColor.mul(circle), 1)
    },
  )

  const colorNode = particleColor({
    spawnPos: spawnPosition,
    uvCoord: uv(),
  })

  return {
    nodes: {
      computeNode,
      positionNode,
      scaleNode,
      colorNode,
    },
  }
})()

const material = new SpriteNodeMaterial({
  positionNode: nodes.positionNode,
  scaleNode: nodes.scaleNode,
  colorNode: nodes.colorNode,
  transparent: true,
  depthWrite: false,
  blending: AdditiveBlending,
})

onMounted(() => {
  ;(renderer as WebGPURenderer).compute(nodes.computeNode)
})
</script>

<template>
  <TresSprite :count="COUNT" :material="material" />
</template>

<style scoped></style>
