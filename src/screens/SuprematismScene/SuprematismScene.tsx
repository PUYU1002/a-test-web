import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { ExtrudedShape } from '../../components/ExtrudedShape';
import { svgShapes } from '../../lib/svg-to-shape';

// 加载组件
const SceneLoader = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-white text-xl">Loading Suprematist Composition...</div>
    </div>
  );
};

// 3D场景内容
const SceneContent = () => {
  return (
    <>
      {/* 相机设置 */}
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} />

      {/* 光照设置 - 营造空间感 */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#ff4444" />

      {/* 环境光照 */}
      <Environment preset="city" />

      {/* 渲染所有的3D形状 */}
      {svgShapes.map((shapeConfig, index) => (
        <ExtrudedShape
          key={index}
          config={shapeConfig}
          index={index}
        />
      ))}

      {/* 轨道控制器 - 允许用户交互 */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        enableZoom={true}
        enablePan={true}
        minDistance={3}
        maxDistance={15}
        autoRotate={false}
      />
    </>
  );
};

export const SuprematismScene: React.FC = () => {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-black">
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>

      {/* UI覆盖层 */}
      <div className="absolute top-4 left-4 text-white z-10">
        <h1 className="text-2xl font-light mb-2">Suprematism</h1>
        <p className="text-sm opacity-75 max-w-xs">
          Experience the floating geometries of Malevich's abstract vision.
          Drag to orbit, scroll to zoom.
        </p>
      </div>

      {/* 控制说明 */}
      <div className="absolute bottom-4 right-4 text-white text-xs opacity-75 z-10">
        <div>Mouse: Orbit • Scroll: Zoom • Drag: Pan</div>
      </div>
    </div>
  );
}; 