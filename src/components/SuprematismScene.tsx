import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { FloatingShape } from './FloatingShape'
import { suprematistElements, convertGeneratedShapesToSVGElements, SVGElement } from '../utils/svgUtils'
import { ControlPanel, AnimationParams, defaultParams } from './ControlPanel'
import { ImageUploader } from './ImageUploader'
import { GeneratedShape } from '../utils/imageProcessor'

function Scene({ animationParams, allShapes }: { animationParams: AnimationParams, allShapes: SVGElement[] }) {
  return (
    <>
      {/* 场景背景颜色 */}
      <color attach="background" args={['#ffffff']} />

      {/* 相机设置 */}
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={75} />

      {/* 光照设置 */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.6}
        castShadow
      />
      <pointLight position={[-5, -5, -5]} intensity={0.2} color="#ff4444" />

      {/* 渲染所有漂浮的几何形状 */}
      {allShapes.map((element, index) => (
        <FloatingShape
          key={element.name}
          element={element}
          index={index}
          animationParams={animationParams}
        />
      ))}

      {/* 交互控制 */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={10}
        autoRotate={animationParams.autoRotateCamera}
        enablePan={true}
      />
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center w-full h-full bg-white">
      <div className="text-black text-xl font-light">
        Loading Suprematist Composition...
      </div>
    </div>
  )
}

export function SuprematismScene() {
  const [animationParams, setAnimationParams] = useState<AnimationParams>(defaultParams)
  const [controlPanelVisible, setControlPanelVisible] = useState(false)
  const [uploaderVisible, setUploaderVisible] = useState(false)
  const [generatedShapes, setGeneratedShapes] = useState<SVGElement[]>([])

  // 合并原始图形和生成的图形
  const allShapes = [...suprematistElements, ...generatedShapes]

  const handleShapesGenerated = (shapes: GeneratedShape[]) => {
    const svgElements = convertGeneratedShapesToSVGElements(shapes)
    setGeneratedShapes(svgElements)
    setUploaderVisible(false)
  }

  return (
    <div className="w-full h-screen relative bg-white">
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
        style={{ background: '#ffffff' }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <Scene animationParams={animationParams} allShapes={allShapes} />
        </Suspense>
      </Canvas>

      {/* 控制面板 */}
      <ControlPanel
        params={animationParams}
        onParamsChange={setAnimationParams}
        isVisible={controlPanelVisible}
        onToggleVisibility={() => setControlPanelVisible(!controlPanelVisible)}
      />

      {/* 图像上传器 */}
      <ImageUploader
        onShapesGenerated={handleShapesGenerated}
        isVisible={uploaderVisible}
        onToggleVisibility={() => setUploaderVisible(!uploaderVisible)}
      />

      {/* UI 覆盖层 */}
      <div className="absolute top-6 left-6 text-black z-10 pointer-events-none">
        <h1 className="text-3xl font-light mb-3 tracking-wider">
          SUPREMATISM
        </h1>
        <p className="text-sm opacity-75 max-w-xs leading-relaxed">
          Abstract geometric forms floating in pure space.<br />
          Drag to orbit • Scroll to zoom • Experience weightlessness.
        </p>
      </div>

      {/* 控制说明 */}
      <div className="absolute bottom-6 right-6 text-black text-xs opacity-60 z-10 pointer-events-none">
        <div className="text-right">
          <div>Mouse: Orbit</div>
          <div>Scroll: Zoom</div>
          <div>Drag: Pan</div>
        </div>
      </div>

      {/* 艺术信息 */}
      <div className="absolute bottom-6 left-6 text-black text-xs opacity-60 z-10 pointer-events-none">
        <div>Inspired by Kazimir Malevich</div>
        <div>Geometric abstraction in 3D space</div>
        {generatedShapes.length > 0 && (
          <div className="mt-1 text-blue-600 font-medium">
            + {generatedShapes.length} shapes from image
          </div>
        )}
      </div>
    </div>
  )
} 