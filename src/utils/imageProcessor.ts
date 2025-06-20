// 图像处理工具 - 将照片转换为至上主义风格的几何图形

export interface ColorRegion {
  color: string;
  pixels: Array<{ x: number, y: number }>;
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
}

export interface GeneratedShape {
  type: 'rectangle' | 'circle' | 'triangle' | 'polygon';
  color: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  path?: string; // SVG路径，用于复杂形状
  center: { x: number, y: number };
  area: number;
}

// 颜色量化 - 将图像简化为少数几种主要颜色
export function quantizeColors(imageData: ImageData, colorCount: number = 8): string[] {
  const colors: { [key: string]: number } = {};
  const data = imageData.data;

  // 采样像素（每10个像素采样一次以提高性能）
  for (let i = 0; i < data.length; i += 40) { // RGBA，所以每个像素4个值，每10个像素就是40
    const r = Math.floor(data[i] / 32) * 32;     // 量化到32的倍数
    const g = Math.floor(data[i + 1] / 32) * 32;
    const b = Math.floor(data[i + 2] / 32) * 32;
    const a = data[i + 3];

    if (a > 128) { // 忽略透明像素
      const colorKey = `rgb(${r},${g},${b})`;
      colors[colorKey] = (colors[colorKey] || 0) + 1;
    }
  }

  // 获取最常见的颜色
  return Object.entries(colors)
    .sort(([, a], [, b]) => b - a)
    .slice(0, colorCount)
    .map(([color]) => color);
}

// 查找颜色区域
export function findColorRegions(imageData: ImageData, targetColors: string[]): ColorRegion[] {
  const regions: ColorRegion[] = [];
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  targetColors.forEach(targetColor => {
    const pixels: Array<{ x: number, y: number }> = [];
    const [r, g, b] = targetColor.match(/\d+/g)!.map(Number);

    let minX = width, maxX = 0, minY = height, maxY = 0;

    for (let y = 0; y < height; y += 2) { // 每2个像素采样一次
      for (let x = 0; x < width; x += 2) {
        const index = (y * width + x) * 4;
        const pixelR = Math.floor(data[index] / 32) * 32;
        const pixelG = Math.floor(data[index + 1] / 32) * 32;
        const pixelB = Math.floor(data[index + 2] / 32) * 32;

        if (Math.abs(pixelR - r) < 32 && Math.abs(pixelG - g) < 32 && Math.abs(pixelB - b) < 32) {
          pixels.push({ x, y });
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }

    if (pixels.length > 100) { // 忽略太小的区域
      regions.push({
        color: targetColor,
        pixels,
        bounds: { minX, maxX, minY, maxY }
      });
    }
  });

  return regions;
}

// 将颜色区域转换为几何图形
export function regionsToShapes(regions: ColorRegion[], imageWidth: number, imageHeight: number): GeneratedShape[] {
  const shapes: GeneratedShape[] = [];

  regions.forEach((region, index) => {
    const bounds = region.bounds;
    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;
    const area = region.pixels.length;
    const aspectRatio = width / height;

    // 计算中心点
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;

    // 根据形状特征决定几何图形类型
    let shapeType: GeneratedShape['type'];
    let path: string | undefined;

    if (aspectRatio > 0.8 && aspectRatio < 1.2 && isCircularRegion(region)) {
      // 接近正方形且分布较圆的区域 -> 圆形
      shapeType = 'circle';
      const radius = Math.min(width, height) / 2;
      path = `M ${centerX + radius} ${centerY} A ${radius} ${radius} 0 1 0 ${centerX - radius} ${centerY} A ${radius} ${radius} 0 1 0 ${centerX + radius} ${centerY} Z`;
    } else if (aspectRatio > 2 || aspectRatio < 0.5) {
      // 长条形 -> 矩形
      shapeType = 'rectangle';
      path = `M ${bounds.minX} ${bounds.minY} L ${bounds.maxX} ${bounds.minY} L ${bounds.maxX} ${bounds.maxY} L ${bounds.minX} ${bounds.maxY} Z`;
    } else if (area < 500 && Math.random() > 0.5) {
      // 小区域随机变成三角形
      shapeType = 'triangle';
      const x1 = centerX;
      const y1 = bounds.minY;
      const x2 = bounds.minX;
      const y2 = bounds.maxY;
      const x3 = bounds.maxX;
      const y3 = bounds.maxY;
      path = `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z`;
    } else {
      // 默认矩形
      shapeType = 'rectangle';
      path = `M ${bounds.minX} ${bounds.minY} L ${bounds.maxX} ${bounds.minY} L ${bounds.maxX} ${bounds.maxY} L ${bounds.minX} ${bounds.maxY} Z`;
    }

    shapes.push({
      type: shapeType,
      color: region.color,
      bounds: {
        x: bounds.minX / imageWidth, // 标准化坐标 (0-1)
        y: bounds.minY / imageHeight,
        width: width / imageWidth,
        height: height / imageHeight
      },
      path,
      center: {
        x: centerX / imageWidth,
        y: centerY / imageHeight
      },
      area
    });
  });

  // 按面积排序，大的形状在后面（Z轴更前）
  return shapes.sort((a, b) => a.area - b.area);
}

// 判断区域是否接近圆形
function isCircularRegion(region: ColorRegion): boolean {
  const bounds = region.bounds;
  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerY = (bounds.minY + bounds.maxY) / 2;
  const radius = Math.min(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) / 2;

  let insideCircle = 0;
  let total = 0;

  region.pixels.forEach(pixel => {
    const distance = Math.sqrt((pixel.x - centerX) ** 2 + (pixel.y - centerY) ** 2);
    if (distance <= radius) insideCircle++;
    total++;
  });

  return (insideCircle / total) > 0.7; // 70%的像素在圆内
}

// 简化颜色为至上主义风格的色彩
export function suprematistColorMapping(color: string): string {
  const [r, g, b] = color.match(/\d+/g)!.map(Number);

  // 计算亮度
  const brightness = (r * 0.299 + g * 0.587 + b * 0.114);

  // 计算色相
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  // 至上主义色彩映射
  if (brightness < 50) {
    return '#000000'; // 黑色
  } else if (brightness > 200) {
    return '#ffffff'; // 白色
  } else if (diff < 30) {
    return '#666666'; // 灰色
  } else if (r > g && r > b) {
    return '#ff0000'; // 红色
  } else if (g > r && g > b) {
    return '#00aa00'; // 绿色（稀少使用）
  } else if (b > r && b > g) {
    return '#0066cc'; // 蓝色
  } else {
    return '#cc6600'; // 橙色/黄色
  }
}

// 主处理函数
export async function processImageToShapes(file: File): Promise<GeneratedShape[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('无法创建Canvas上下文'));
        return;
      }

      // 限制图像大小以提高性能
      const maxSize = 400;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // 处理图像
      const colors = quantizeColors(imageData, 6);
      const mappedColors = colors.map(suprematistColorMapping);
      const regions = findColorRegions(imageData, colors);
      const shapes = regionsToShapes(regions, canvas.width, canvas.height);

      // 应用至上主义色彩映射
      const finalShapes = shapes.map(shape => ({
        ...shape,
        color: suprematistColorMapping(shape.color)
      }));

      resolve(finalShapes);
    };

    img.onerror = () => reject(new Error('图像加载失败'));
    img.src = URL.createObjectURL(file);
  });
}