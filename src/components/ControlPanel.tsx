import React, { useState } from 'react'

export interface AnimationParams {
  // 漂浮参数
  floatSpeed: number
  floatAmplitude: number
  floatXEnabled: boolean
  floatYEnabled: boolean

  // 旋转参数
  rotationSpeed: number
  rotationAmplitude: number
  rotationXEnabled: boolean
  rotationYEnabled: boolean
  rotationZEnabled: boolean

  // 缩放参数
  breatheSpeed: number
  breatheAmplitude: number
  breatheEnabled: boolean

  // 全局参数
  timeScale: number
  autoRotateCamera: boolean
}

export const defaultParams: AnimationParams = {
  floatSpeed: 0.4,
  floatAmplitude: 0.3,
  floatXEnabled: true,
  floatYEnabled: true,

  rotationSpeed: 0.15,
  rotationAmplitude: 0.15,
  rotationXEnabled: true,
  rotationYEnabled: true,
  rotationZEnabled: true,

  breatheSpeed: 0.6,
  breatheAmplitude: 0.08,
  breatheEnabled: true,

  timeScale: 1.0,
  autoRotateCamera: false
}

interface ControlPanelProps {
  params: AnimationParams
  onParamsChange: (params: AnimationParams) => void
  isVisible: boolean
  onToggleVisibility: () => void
}

export function ControlPanel({ params, onParamsChange, isVisible, onToggleVisibility }: ControlPanelProps) {
  const updateParam = (key: keyof AnimationParams, value: number | boolean) => {
    onParamsChange({
      ...params,
      [key]: value
    })
  }

  return (
    <>
      {/* 控制按钮 */}
      <button
        onClick={onToggleVisibility}
        className="fixed top-4 right-4 z-50 bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-all"
        title="Toggle Control Panel"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>

      {/* 控制面板 */}
      {isVisible && (
        <div className="fixed top-4 right-16 z-40 bg-white bg-opacity-95 backdrop-blur-sm p-4 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto w-72">
          <h3 className="text-lg font-light mb-4 text-black border-b pb-2">Animation Controls</h3>

          {/* 漂浮控制 */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3 text-gray-800">Float Motion</h4>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Speed</label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={params.floatSpeed}
                  onChange={(e) => updateParam('floatSpeed', parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{params.floatSpeed.toFixed(1)}</span>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Amplitude</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={params.floatAmplitude}
                  onChange={(e) => updateParam('floatAmplitude', parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{params.floatAmplitude.toFixed(2)}</span>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={params.floatXEnabled}
                    onChange={(e) => updateParam('floatXEnabled', e.target.checked)}
                    className="mr-1"
                  />
                  X-axis
                </label>
                <label className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={params.floatYEnabled}
                    onChange={(e) => updateParam('floatYEnabled', e.target.checked)}
                    className="mr-1"
                  />
                  Y-axis
                </label>
              </div>
            </div>
          </div>

          {/* 旋转控制 */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3 text-gray-800">Rotation</h4>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Speed</label>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.01"
                  value={params.rotationSpeed}
                  onChange={(e) => updateParam('rotationSpeed', parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{params.rotationSpeed.toFixed(2)}</span>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Amplitude</label>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.01"
                  value={params.rotationAmplitude}
                  onChange={(e) => updateParam('rotationAmplitude', parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{params.rotationAmplitude.toFixed(2)}</span>
              </div>

              <div className="flex gap-2">
                <label className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={params.rotationXEnabled}
                    onChange={(e) => updateParam('rotationXEnabled', e.target.checked)}
                    className="mr-1"
                  />
                  X
                </label>
                <label className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={params.rotationYEnabled}
                    onChange={(e) => updateParam('rotationYEnabled', e.target.checked)}
                    className="mr-1"
                  />
                  Y
                </label>
                <label className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={params.rotationZEnabled}
                    onChange={(e) => updateParam('rotationZEnabled', e.target.checked)}
                    className="mr-1"
                  />
                  Z
                </label>
              </div>
            </div>
          </div>

          {/* 呼吸效果控制 */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3 text-gray-800">Breathing Scale</h4>

            <div className="space-y-3">
              <label className="flex items-center text-xs mb-2">
                <input
                  type="checkbox"
                  checked={params.breatheEnabled}
                  onChange={(e) => updateParam('breatheEnabled', e.target.checked)}
                  className="mr-2"
                />
                Enable Breathing
              </label>

              {params.breatheEnabled && (
                <>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Speed</label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={params.breatheSpeed}
                      onChange={(e) => updateParam('breatheSpeed', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-500">{params.breatheSpeed.toFixed(1)}</span>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Amplitude</label>
                    <input
                      type="range"
                      min="0"
                      max="0.3"
                      step="0.01"
                      value={params.breatheAmplitude}
                      onChange={(e) => updateParam('breatheAmplitude', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-500">{params.breatheAmplitude.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 全局控制 */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-gray-800">Global</h4>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Time Scale</label>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={params.timeScale}
                  onChange={(e) => updateParam('timeScale', parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{params.timeScale.toFixed(1)}x</span>
              </div>

              <label className="flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={params.autoRotateCamera}
                  onChange={(e) => updateParam('autoRotateCamera', e.target.checked)}
                  className="mr-2"
                />
                Auto Rotate Camera
              </label>
            </div>
          </div>

          {/* 重置按钮 */}
          <button
            onClick={() => onParamsChange(defaultParams)}
            className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded text-xs transition-colors"
          >
            Reset to Default
          </button>
        </div>
      )}
    </>
  )
} 