import React, { useState, useRef } from 'react'
import { processImageToShapes, GeneratedShape } from '../utils/imageProcessor'

interface ImageUploaderProps {
  onShapesGenerated: (shapes: GeneratedShape[]) => void
  isVisible: boolean
  onToggleVisibility: () => void
}

export function ImageUploader({ onShapesGenerated, isVisible, onToggleVisibility }: ImageUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [processedShapes, setProcessedShapes] = useState<GeneratedShape[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图像文件！')
      return
    }

    setIsProcessing(true)
    setPreviewImage(URL.createObjectURL(file))

    try {
      const shapes = await processImageToShapes(file)
      setProcessedShapes(shapes)
      console.log('Generated shapes:', shapes)
    } catch (error) {
      console.error('图像处理失败:', error)
      alert('图像处理失败，请尝试其他图片')
    } finally {
      setIsProcessing(false)
    }
  }

  const applyShapesToScene = () => {
    if (processedShapes.length > 0) {
      onShapesGenerated(processedShapes)
      alert(`成功生成 ${processedShapes.length} 个几何图形！`)
    }
  }

  const resetUploader = () => {
    setPreviewImage(null)
    setProcessedShapes([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      {/* 上传按钮 */}
      <button
        onClick={onToggleVisibility}
        className="fixed top-16 right-4 z-50 bg-blue-600 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-all"
        title="Upload Image"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      </button>

      {/* 上传界面 */}
      {isVisible && (
        <div className="fixed top-16 right-16 z-40 bg-white bg-opacity-95 backdrop-blur-sm p-4 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-light text-black">Image to Shapes</h3>
            <button
              onClick={onToggleVisibility}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* 文件上传区域 */}
          <div className="mb-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-400 transition-colors"
            >
              {previewImage ? (
                <div>
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <p className="text-xs text-gray-600">Click to change image</p>
                </div>
              ) : (
                <div>
                  <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                  <p className="text-sm text-gray-600">Upload your image</p>
                  <p className="text-xs text-gray-400">JPG, PNG, GIF up to 10MB</p>
                </div>
              )}
            </label>
          </div>

          {/* 处理状态 */}
          {isProcessing && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-sm text-blue-800">Analyzing image...</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Converting to geometric shapes
              </p>
            </div>
          )}

          {/* 处理结果 */}
          {processedShapes.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 text-gray-800">
                Generated Shapes: {processedShapes.length}
              </h4>

              <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                {processedShapes.map((shape, index) => (
                  <div key={index} className="flex items-center text-xs">
                    <div
                      className="w-4 h-4 rounded mr-2 border"
                      style={{ backgroundColor: shape.color }}
                    ></div>
                    <span className="flex-1 text-gray-600">
                      {shape.type} ({Math.round(shape.bounds.width * 100)}×{Math.round(shape.bounds.height * 100)})
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={applyShapesToScene}
                  className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Apply to Scene
                </button>
                <button
                  onClick={resetUploader}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* 说明文字 */}
          <div className="text-xs text-gray-500 border-t pt-3">
            <p className="mb-1">• Upload any image to convert it into abstract geometric shapes</p>
            <p className="mb-1">• Colors will be simplified to Suprematist palette</p>
            <p>• Shapes will be added to the 3D scene</p>
          </div>
        </div>
      )}
    </>
  )
} 