<script setup lang="ts">
import { useLoop, useTres } from '@tresjs/core'
import {
  cos,
  distance,
  float,
  Fn,
  fract,
  instancedArray,
  instanceIndex,
  min,
  mix,
  mul,
  PI,
  PI2,
  sin,
  smoothstep,
  sqrt,
  uv,
  vec2,
  vec3,
  vec4,
} from 'three/tsl'
import { AdditiveBlending, SpriteNodeMaterial, WebGPURenderer } from 'three/webgpu'

const COUNT = 30000

const { renderer } = useTres()

const { onRender } = useLoop()

const { nodes } = (() => {
  const spawnPositionBuffer = instancedArray(COUNT, 'vec3')
  const offsetPositionsBuffer = instancedArray(COUNT, 'vec3')

  const spawnPosition = spawnPositionBuffer.element(instanceIndex)
  const offsetPosition = offsetPositionsBuffer.element(instanceIndex)

  // 生成 0-1 随机数
  const hash = Fn(([index]: [number]) => {
    return fract(sin(float(index).mul(12.9898)).mul(43758.5453))
  })

  const thomasAttractor = Fn(([pos]: [ReturnType<typeof vec3>]) => {
    const b = 0.19
    const dt = 0.015

    const x = pos.x
    const y = pos.y
    const z = pos.z

    const dx = float(b).negate().mul(x).add(sin(y)).mul(dt)
    const dy = float(b).negate().mul(y).add(sin(z)).mul(dt)
    const dz = float(b).negate().mul(z).add(sin(x)).mul(dt)
    return vec3(dx, dy, dz)
  })

  const computeInit = Fn(() => {
    const index = instanceIndex
    const h0 = hash(index)
    const h1 = hash(index.add(1))
    const h2 = hash(index.add(2))

    const dist = sqrt(h0.mul(4))
    const theta = h1.mul(PI2)
    const phi = h2.mul(PI)

    const x = mul(dist, sin(phi), cos(theta))
    const y = mul(dist, sin(phi), sin(theta))
    const z = mul(dist, cos(phi))

    // 赋值初始位置
    spawnPosition.assign(vec3(x, y, z))
    // 赋值初始偏移位置，这里可以注释是因为默认为 0 向量
    // offsetPosition.assign(vec3(0))
  })

  const computeNode = computeInit().compute(COUNT)

  const computeNodeUpdate = Fn(() => {
    const updatedOffsetPosition = thomasAttractor(spawnPosition.add(offsetPosition))
    offsetPosition.addAssign(updatedOffsetPosition)
  })().compute(COUNT)

  const positionNode = Fn(() => {
    const pos = spawnPosition.add(offsetPosition)
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
      offsetPos,
      uvCoord,
    }: {
      spawnPos: ReturnType<typeof vec3>
      offsetPos: ReturnType<typeof vec3>
      uvCoord: ReturnType<typeof vec2>
    }) => {
      const baseColor = vec3(0.24, 0.43, 0.96)
      const distanceToCenter = min(distance(spawnPos.add(offsetPos), vec3(0)), 2.75)

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
    offsetPos: offsetPosition,
    uvCoord: uv(),
  })

  return {
    nodes: {
      positionNode,
      computeNode,
      computeNodeUpdate,
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

// 这里不需要放到 onMounted 中，因为我们使用的是 TresCanvas 的自定义渲染器，renderer 已经是 WebGPURenderer 实例了
;(renderer as WebGPURenderer).compute(nodes.computeNode)

// 这里的优先级表示在其他 onRender 之后执行
onRender(() => {
  ;(renderer as WebGPURenderer).compute(nodes.computeNodeUpdate)
}, 1)
</script>

<template>
  <TresSprite :count="COUNT" :material="material" />
</template>

<style scoped></style>
