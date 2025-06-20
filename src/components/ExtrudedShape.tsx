import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { ExtrudeGeometry } from 'three';
import { createShapeFromSVGPath, SVGShapeConfig } from '../lib/svg-to-shape';
import * as THREE from 'three';

interface ExtrudedShapeProps {
  config: SVGShapeConfig;
  index: number;
}

export const ExtrudedShape: React.FC<ExtrudedShapeProps> = ({ config, index }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // 创建几何体
  const geometry = useMemo(() => {
    const shape = createShapeFromSVGPath(config.path);

    // 挤出设置 - 创建薄薄的3D效果
    const extrudeSettings = {
      depth: 0.1, // 薄薄的深度，符合至上主义的轻盈感
      bevelEnabled: false, // 不需要倒角，保持几何的纯粹性
    };

    return new ExtrudeGeometry(shape, extrudeSettings);
  }, [config.path]);

  // 动画：实现漂浮和旋转效果
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();

      // 基于索引的偏移，让每个形状有不同的动画节奏
      const offset = index * 0.5;

      // 漂浮动画 - 上下轻微浮动
      const floatY = Math.sin(time * 0.5 + offset) * 0.2;

      // 旋转动画 - 缓慢旋转，体现失重感
      const rotationX = Math.sin(time * 0.3 + offset) * 0.1;
      const rotationY = time * 0.1 + offset;
      const rotationZ = Math.cos(time * 0.4 + offset) * 0.05;

      // 应用变换
      meshRef.current.position.y = config.position.y + floatY;
      meshRef.current.rotation.x = rotationX;
      meshRef.current.rotation.y = rotationY;
      meshRef.current.rotation.z = rotationZ;

      // 轻微的缩放呼吸效果
      const scale = config.scale * (1 + Math.sin(time * 0.8 + offset) * 0.05);
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={[config.position.x, config.position.y, config.position.z]}
      scale={config.scale}
    >
      <meshStandardMaterial
        color={config.color}
        roughness={0.1}
        metalness={0.2}
        transparent={true}
        opacity={0.9}
      />
    </mesh>
  );
}; 