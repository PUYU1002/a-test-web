import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, ExtrudeGeometry } from 'three'
import { createShapeFromPath, SVGElement } from '../utils/svgUtils'
import { AnimationParams } from './ControlPanel'

interface FloatingShapeProps {
  element: SVGElement
  index: number
  animationParams: AnimationParams
}

export function FloatingShape({ element, index, animationParams }: FloatingShapeProps) {
  const meshRef = useRef<Mesh>(null!)

  // 创建几何体
  const geometry = useMemo(() => {
    const shape = createShapeFromPath(element.path)

    const extrudeSettings = {
      depth: 0.1, // 薄薄的3D效果
      bevelEnabled: false, // 保持几何纯粹性
    }

    return new ExtrudeGeometry(shape, extrudeSettings)
  }, [element.path])

  // 动画循环
  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.getElapsedTime() * animationParams.timeScale
    const offset = index * 0.7 // 每个形状不同的节奏

    // 漂浮动画
    const floatY = animationParams.floatYEnabled
      ? Math.sin(time * animationParams.floatSpeed + offset) * animationParams.floatAmplitude
      : 0
    const floatX = animationParams.floatXEnabled
      ? Math.cos(time * animationParams.floatSpeed * 0.75 + offset) * animationParams.floatAmplitude * 0.3
      : 0

    // 旋转动画 - 至上主义的失重感
    const rotationX = animationParams.rotationXEnabled
      ? Math.sin(time * animationParams.rotationSpeed * 1.3 + offset) * animationParams.rotationAmplitude
      : 0
    const rotationY = animationParams.rotationYEnabled
      ? time * animationParams.rotationSpeed + offset
      : 0
    const rotationZ = animationParams.rotationZEnabled
      ? Math.cos(time * animationParams.rotationSpeed * 1.7 + offset) * animationParams.rotationAmplitude * 0.7
      : 0

    // 轻微的尺寸变化
    const breathe = animationParams.breatheEnabled
      ? 1 + Math.sin(time * animationParams.breatheSpeed + offset) * animationParams.breatheAmplitude
      : 1

    // 应用变换
    meshRef.current.position.x = element.position[0] + floatX
    meshRef.current.position.y = element.position[1] + floatY
    meshRef.current.position.z = element.position[2]

    meshRef.current.rotation.x = rotationX
    meshRef.current.rotation.y = rotationY
    meshRef.current.rotation.z = rotationZ

    meshRef.current.scale.setScalar(element.scale * breathe)
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={element.position}
      scale={element.scale}
    >
      <meshStandardMaterial
        color={element.color}
        roughness={0.1}
        metalness={0.3}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
} 